import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/Footer/Footer';
import Home from './views/Home';
import Certificates from './views/Certificates';
import Emails from './views/Emails';
import AddCertificates from './views/AddCertificates';
// import EditCertificate from './views/EditCertificate'

function App() {
  return (
    <BrowserRouter>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/certificados' element={<Certificates/>} />
            <Route path='/emails' element={<Emails/>} />
            <Route path='/adicionarCertificado' element={<AddCertificates/>} />
          </Routes>
          <Footer />
        </div>
    </BrowserRouter>
  );
}

export default App;
