import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './Screens/Home.jsx';
import Contacto from './Screens/Contacto.jsx';
import Juegos from './Screens/Juegos.jsx';
import Login from './Screens/Login.jsx';
import Registro from './Screens/Registro.jsx';
import Navbar from './Components/Navbar.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </>
  );
}

export default App;
