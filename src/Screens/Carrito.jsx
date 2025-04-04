import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "./Carrito.module.css";
import { MdDelete } from "react-icons/md";

const Carrito = () => {
  const { cart, removeFromCart, getTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado para manejar el loading

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Suponiendo que el total se calcula en getTotal() y que el ID de la sesión y el número de orden se generan en el frontend
      const response = await fetch("http://localhost:8000/api/create_transaction/", {
        method: "POST",  // 🚀 Importante: asegúrate de que realmente sea POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getTotal(),
          buy_order: `ORDEN-${new Date().getTime()}`,
          session_id: "SESSION123",
        }),
      });
  
      const data = await response.json();
      console.log("Respuesta de la API:", data);
  
      if (data.url_webpay) {
        window.location.href = data.url_webpay;
      }
       else {
        alert("Hubo un error al procesar la transacción.");
      }
    } catch (error) {
      console.error("Error al intentar procesar el pago:", error);
      alert("Error al intentar procesar el pago.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.cartContainer}>
      {cart.length === 0 ? (
        <p className={styles.empty}>Tu carrito está vacío</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((juego) => (
              <li key={juego.id} className={styles.cartItem}>
                <img src={juego.imagen} alt={juego.nombre} className={styles.image} />
                <div className={styles.info}>
                  <h2>{juego.nombre}</h2>
                  <p className={styles.price}>
                    {new Intl.NumberFormat("es-CL", {
                      style: "currency",
                      currency: "CLP", // Moneda pesos chilenos
                    }).format(juego.precio)}
                  </p>
                  <p>Cantidad: {juego.cantidad}</p>
                </div>
                <button className={styles.removeButton} onClick={() => removeFromCart(juego.id)}>
                  <MdDelete />
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.cartSummary}>
            <h2 className={styles.total}>Total: ${getTotal().toLocaleString("es-CL")}</h2>
            <button className={styles.payButton} onClick={handlePayment} disabled={loading}>
              {loading ? "Cargando..." : "Ir a pagar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
