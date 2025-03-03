import { Feature, View } from 'ol';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { useEffect, useRef, useState } from 'react';

function UserInput() {

   const [location, setLocation] = useState(null);
   const [locationName, setLocationName] = useState('');
   const [status, setStatus] = useState('');
   const [error, setError] = useState(null);
   const [name, setName] = useState('')
   const [email, setEmail] = useState(null)
   const [loading, setLoading] = useState(false);
   const [submitLoading, setSubmitLoading] = useState(false);
   const [submitMessage, setSubmitMessage] = useState(null);
   const mapRef = useRef(null);


   const handleSubmit = async () => {
      if (!locationName || !status) {
         setError('Please get your location and set your status before submitting')
         return
      }

      setSubmitLoading(true)
      setSubmitMessage(null)
      setError(null)

      try {
         const selectedID = await fetch('http://10.0.103.0:3000/api/products')
            .then(response => response.json())
            .then(data => data.find(user => user.name === name && user.email === email))

         if (selectedID) {
            console.log('id: ', selectedID._id)
            const response = await fetch(`http://10.0.103.0:3000/api/products/${selectedID._id}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  geotag: locationName,
                  status: status === 'available'
               })
            })

            if (!response.ok) {
               throw new Error('Failed to update profile')
            }

            setSubmitMessage('Profile updated successfully!')
            setTimeout(() => window.location.reload(), 1000) // Debug Refresh bro.
         }
         else {
            alert('Name or Email Not Matched')
            return
         }


      } catch (err) {
         setError('Failed to update profile: ' + err.message)
      } finally {
         setSubmitLoading(false)
      }
   }

   useEffect(() => {
      if (location && mapRef.current) {
         const map = new Map({
            target: mapRef.current,
            layers: [
               new TileLayer({
                  source: new OSM(),
               }),
            ],
            view: new View({
               center: fromLonLat([location.lng, location.lat]),
               zoom: 13,
            }),
         });

         const marker = new Feature({
            geometry: new Point(fromLonLat([location.lng, location.lat])),
         });

         marker.setStyle(
            new Style({
               image: new Icon({
                  src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                  scale: 0.1,
               }),
            })
         );

         const vectorLayer = new VectorLayer({
            source: new VectorSource({
               features: [marker],
            }),
         });

         map.addLayer(vectorLayer);
      }
   }, [location]);

   const getLocation = () => {
      setError(null);
      setLoading(true);
      setLocationName('');

      if (!navigator.geolocation) {
         setError('Geolocation is not supported by your browser');
         setLoading(false);
         return;
      }

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLocation({ lat, lng });

            try {
               const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                  {
                     headers: { 'Accept-Language': 'en-US' }
                  }
               );
               const data = await response.json();
               const shortName = data.address.road || data.address.city || 'Unknown location';
               setLocationName(shortName);
            } catch (err) {
               setError('Failed to get location name');
            }

            setLoading(false);
         },
         (err) => {
            setError('Unable to retrieve your location: ' + err.message);
            setLoading(false);
         }
      );
   };

   return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
         <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>

         <div className='w-max my-10'>
            <h2>Name</h2>
            <input onChange={(e) => setName(e.target.value)}
               type="text" className='border-2 border-black rounded-lg'></input>
            <h2>Email</h2>
            <input onChange={(e) => setEmail(e.target.value)}
               type="email" className='border-2 border-black rounded-lg'></input>
         </div>

         <hr className='h-10'></hr>

         {submitMessage && <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded">{submitMessage}</div>}
         {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">{error}</div>}

         <div className="grid md:grid-cols-2 gap-20">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">Location</h3>
                  <button onClick={getLocation} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                     {loading ? 'Getting location...' : 'Get Location'}
                  </button>
               </div>
               {location && (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                     <p className="text-sm font-medium text-gray-700">Latitude: {location.lat.toFixed(6)}</p>
                     <p className="text-sm font-medium text-gray-700">Longitude: {location.lng.toFixed(6)}</p>
                     {locationName && <p className="text-sm font-medium text-blue-600">Location: {locationName}</p>}
                  </div>
               )}
               {location && (
                  <div ref={mapRef} style={{ height: '300px', width: '100%' }} className="rounded-md border border-gray-300"></div>
               )}
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-medium text-gray-700">Status</h3>
               <select value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="" disabled>Select your status</option>
                  <option value="available">Available</option>
                  <option value="not-available">Not Available</option>
               </select>
               {status && <p className={status === 'available' ? 'text-green-600' : 'text-red-600'}>Current Status: {status}</p>}
            </div>
         </div>



         <div className="mt-6 flex justify-end">
            <button onClick={handleSubmit} disabled={submitLoading || !location || !status || !name || !email} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
               {submitLoading ? 'Updating...' : 'Update Profile'}
            </button>
         </div>
      </div >
   );
}


export default UserInput;