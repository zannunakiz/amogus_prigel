import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const Geogus = () => {
   const customIcon = new L.Icon({
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [41, 41]
   })

   const [location, setLocation] = useState(null)
   const [address, setAddress] = useState(null)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [shortAddress, setShortAddress] = useState(null)

   const getAddress = async (latitude, longitude) => {
      try {
         const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
               headers: {
                  'User-Agent': 'YourApp/1.0'
               }
            }
         )
         const data = await response.json()
         setAddress(data.display_name)

         const shorten = data.display_name.split(",")[0].trim();
         setShortAddress(shorten)
      } catch (err) {
         console.error('Error fetching address:', err)
         setError('Unable to fetch address')
      }
   }

   const getLocation = () => {
      setLoading(true)
      setError(null)
      setAddress(null)

      if (!navigator.geolocation) {
         setError('Geolocation is not supported by your browser')
         setLoading(false)
         return
      }

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            const newLocation = {
               latitude: position.coords.latitude,
               longitude: position.coords.longitude
            }
            setLocation(newLocation)
            await getAddress(newLocation.latitude, newLocation.longitude)
            setLoading(false)
         },
         (error) => {
            setError('Unable to retrieve your location')
            setLoading(false)
         }
      )
   }

   const submitGeotag = async () => {
      if (!shortAddress) return;

      try {
         const response = await fetch('http://localhost:3000/api/products/67c2b99dc6f030d507111612', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ geotag: shortAddress })
         });

         if (!response.ok) {
            throw new Error('Failed to update geotag');
         }

         alert('Geotag updated successfully!');
      } catch (err) {
         console.error('Error updating geotag:', err);
         alert('Failed to update geotag');
      }
   }

   return (
      <div>
         <h1 className="font-bold text-[2rem] mt-10">GEGUS (GEO MOGUS)</h1>

         <button
            onClick={getLocation}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
         >
            {loading ? 'Getting Location...' : 'Get My Location'}
         </button>

         {error && (
            <p className="mt-4 text-red-500">{error}</p>
         )}

         {location && (
            <div className="mt-4 space-y-2">
               <p className="text-lg">Latitude: {location.latitude}</p>
               <p className="text-lg">Longitude: {location.longitude}</p>
               {address && (
                  <div>
                     <p className="text-lg font-semibold mt-2">Lokasi Kemalingan:</p>
                     <p className="text-lg text-gray-700">{address}</p>
                     <p>Short Address: <span className='font-bold text-blue-600'>{shortAddress}</span></p>
                  </div>
               )}

               {/* Map Display */}
               <div className="mt-6 w-full h-[400px]">
                  <MapContainer center={[location.latitude, location.longitude]} zoom={15} style={{ height: "400px", width: "100%" }}>
                     <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     />
                     <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
                        <Popup>You are here!</Popup>
                     </Marker>
                  </MapContainer>
               </div>

               {/* Submit Button */}
               <button
                  onClick={submitGeotag}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={!shortAddress}
               >
                  Submit Geotag
               </button>
            </div>
         )}
      </div>
   )
}

export default Geogus
