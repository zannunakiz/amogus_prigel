import { useState } from "react"

const Input = () => {
   const [isLoading, setIsLoading] = useState(false)
   const [selectedStatus, setSelectedStatus] = useState("available")

   const updateStatus = async () => {
      setIsLoading(true)
      const newStatus = selectedStatus === "available"

      try {
         const res = await fetch("http://localhost:3000/api/products/67c2b99dc6f030d507111612", {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(
               {
                  status: newStatus,

               }),
         })

         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
      } catch (err) {
         console.error("Error updating status:", err)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className="relative inline-block">
         <h1 className="font-bold text-[2rem] mt-10">IGUS (INPUT MOGUS)</h1>
         <select
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={isLoading}
            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white text-gray-900 appearance-none cursor-pointer"
         >
            <option value="available">Available</option>
            <option value="not-available">Not Available</option>
         </select>
         <button
            onClick={updateStatus}
            disabled={isLoading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
         >
            Submit
         </button>
         {isLoading && (
            <div className="absolute right-2 top-2">
               <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
               >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
               </svg>
            </div>
         )}
      </div>
   )
}

export default Input
