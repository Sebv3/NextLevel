import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./Screens/Home.jsx";
import Contacto from "./Screens/Contacto.jsx";
import Juegos from "./Screens/Juegos.jsx";
import Login from "./Screens/Login.jsx";
import Registro from "./Screens/Registro.jsx";
import Carrito from "./Screens/Carrito.jsx";
import Pago from "./Screens/Pago.jsx";
import Navbar from "./Components/Navbar.jsx";
import CartProvider from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pago" element={<Pago />} /> {/* ✅ RUTA CORRECTA */}
      </Routes>
    </CartProvider>
  );
}

export default App;
