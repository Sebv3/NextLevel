import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import styles from "./Carrito.module.css";
import { MdDelete } from "react-icons/md";

const Carrito = () => {
  const { cart, removeFromCart, getTotal } = useContext(CartContext);

  return (
    <div className={styles.cartContainer}>
      {cart.length === 0 ? (
        <p className={styles.empty}>Tu carrito está vacío</p>
      ) : (
        <>
          {/* Sección de productos */}
          <ul className={styles.cartList}>
            {cart.map((juego) => (
              <li key={juego.id} className={styles.cartItem}>
                <img src={juego.imagen} alt={juego.nombre} className={styles.image} />
                <div className={styles.info}>
                  <h2>{juego.nombre}</h2>
                  <p>${juego.precio.toLocaleString("es-CL")}</p>
                  <p>Cantidad: {juego.cantidad}</p>
                </div>
                <button className={styles.removeButton} onClick={() => removeFromCart(juego.id)}>
                  <MdDelete />
                </button>
              </li>
            ))}
          </ul>

          {/* Resumen del total y botón de pago */}
          <div className={styles.cartSummary}>
            <h2 className={styles.total}>Total: ${getTotal().toLocaleString("es-CL")}</h2>
            <button className={styles.payButton}>Ir a pagar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
