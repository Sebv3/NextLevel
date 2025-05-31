import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./Screens/Home.jsx";
import Contacto from "./Screens/Contacto.jsx";
import Juegos from "./Screens/Juegos.jsx";
import Login from "./Screens/Login.jsx";
import Carrito from "./Screens/Carrito.jsx";
import Pago from "./Screens/Pago.jsx";
import Nuevos from "./Screens/Nuevos.jsx";
import Navbar from "./Components/Navbar.jsx";
import CartProvider from "./context/CartContext";
import Footer from "./Components/footer.jsx";
import Perfil from "./Screens/Perfil.jsx";


function App() {
  return (
    <CartProvider>
      <div className="appLayout"> 
        <Navbar />
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/pago" element={<Pago />} />
            <Route path="/nuevos" element={<Nuevos />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
