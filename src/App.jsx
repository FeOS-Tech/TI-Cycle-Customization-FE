import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Kids from './Pages/Kids'
import MTB from './Pages/MTB'
import Inspired from './Pages/Inspired'
import CycleList from './Pages/CycleList'
import Customization from './Pages/Customization'
import SportyCustomize from './Pages/SportyCustomize'
import FunCustomize from './Pages/FunCustomizw'
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/kids' element={<Kids/>}/>
        <Route path='/mtb' element={<MTB/>}/>
        <Route path='/inspired' element={<Inspired/>}/>
                {/* Many cycles under that theme */}
        {/* <Route path="/kids/:slug" element={<CycleList />} /> */}

        {/* Final customisation page for selected cycle */}
        <Route path="/kids/:slug" element={<Customization />} />
        {/* <Route
          path="/kids/:slug/customize/sporty"
          element={<SportyCustomize />}
        />
        <Route path="/kids/:slug/customize/fun" element={<FunCustomize />} /> */}
        <Route path="/kids/:slug/customize/sporty/:customId" element={<SportyCustomize />}/>
        <Route path="/kids/:slug/customize/fun/:customId" element={<FunCustomize />}/>

      </Routes>

    </BrowserRouter>

  )
}

export default App
