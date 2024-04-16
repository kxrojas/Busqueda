import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BMSearchComponent from './components/BMSearchComponent'

export const App = () => {

  return (
    <div>
      <BrowserRouter>
        
        <div className='container'>
          <Routes>
            <Route path='/search' element={<BMSearchComponent />}></Route>
          </Routes>
        </div>
      </BrowserRouter>

    </div>
  );

}


