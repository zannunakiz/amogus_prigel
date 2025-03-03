import React, { useEffect, useState } from 'react'
import './index.css'
import Profile from './Profile'

function App() {



  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/api/products')

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-300 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Anggota Lomba makan krupuk</h1>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
            <p>{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geotag</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.geotag ? `${product.geotag}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === true
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {product.status ? "Available" : 'not available'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile component */}
        <div className="mt-10">
          <Profile />
        </div>
      </div>
    </div>
  )
}

export default App


//APP v2 with input sama GEOGUS

// import { useEffect, useState } from "react";
// import Geogus from './Geogus';
// import Input from "./Input";

// const App = () => {
//   const [database, setDatabase] = useState([]);
//   const email = "solutions@gmail.com";

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch("http://localhost:3000/api/products");
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         const data = await res.json();
//         setDatabase(data);
//         console.log(data);
//       } catch (err) {
//         console.log("Error:", err.message);
//       }
//     }

//     fetchData();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="font-bold text-3xl mt-10 mb-6 text-center">Anggota Lomba Makan Kerupuk</h1>

//       <section className="overflow-x-auto rounded-lg shadow-lg">
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr className="bg-gray-100 border-b">
//               <th className="py-3 px-6 text-left font-medium text-gray-600 uppercase tracking-wider">Name</th>
//               <th className="py-3 px-6 text-left font-medium text-gray-600 uppercase tracking-wider">Email</th>
//               <th className="py-3 px-6 text-left font-medium text-gray-600 uppercase tracking-wider">Geotag</th>
//               <th className="py-3 px-6 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {database && database.length > 0 ? (
//               database.map((account, index) => (
//                 <tr key={index} className={`hover:bg-gray-50 ${account.email === email ? "bg-blue-50" : ""}`}>
//                   <td className="py-4 px-6 text-sm text-gray-900">{account.name}</td>
//                   <td className="py-4 px-6 text-sm text-gray-900">{account.email}</td>
//                   <td className="py-4 px-6 text-sm text-gray-900">{account.geotag}</td>
//                   <td className="py-4 px-6 text-sm">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${account.status === true
//                         ? "text-green-800 bg-green-100"
//                         : "text-red-800 bg-red-100"
//                         }`}
//                     >
//                       {account.status ? "Langsung Masuk mas" : "Lagi diluar"}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="py-4 px-6 text-sm text-center text-gray-500">
//                   Loading data...
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </section>

//       <Input />
//       <Geogus />
//     </div>
//   );
// };

// export default App;