import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from './App'
import Table from './Table'
import UserInput from './UserInput'

const Main = () => {
   return (
      <div>
         <Routes>
            <Route path="/" element={<App />} />
            <Route path="/table" element={<Table />} />
            <Route path="/user" element={<UserInput />} />

         </Routes>
      </div>
   )
}

export default Main