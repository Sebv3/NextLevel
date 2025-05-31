import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "./Carrito.module.css";
import { MdDelete } from "react-icons/md";

const Carrito = () => {
  const { cart, removeFromCart, getTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const handlePayment = async () => {
    if (!direccion || !telefono) {
      alert("Por favor completa dirección y teléfono.");
      return;
    }

    setLoading(true);
    const sessionId = `session-${Date.now()}`;
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("No estás autenticado, por favor inicia sesión.");
        setLoading(false);
        return;
      }

      // Crear pedido
      const crearPedidoResponse = await fetch("http://localhost:8000/api/pedidos/crear/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          direccion_envio: direccion,
          telefono_contacto: telefono,
          total: getTotal(),
          productos: cart.map(item => ({ id: item.id, cantidad: item.cantidad })),
          session_id: sessionId,
        }),
      });

      if (!crearPedidoResponse.ok) {
        const errorData = await crearPedidoResponse.json();
        alert("Error al crear el pedido: " + (errorData.detail || JSON.stringify(errorData)));
        setLoading(false);
        return;
      }

      const pedidoData = await crearPedidoResponse.json();

      // Crear transacción
      const transactionResponse = await fetch("http://localhost:8000/api/create_transaction/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: getTotal(),
          pedido_id: pedidoData.pedido_id,
          session_id: sessionId,
        }),
      });

      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        alert("Error al procesar la transacción: " + (errorData.error || JSON.stringify(errorData)));
        setLoading(false);
        return;
      }

      const transactionData = await transactionResponse.json();

      if (transactionData.url_webpay) {
        clearCart();
        window.location.href = transactionData.url_webpay;
      } else {
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
                      currency: "CLP",
                    }).format(juego.precio)}
                  </p>
                  <p>Cantidad: {juego.cantidad}</p>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(juego.id)}
                >
                  <MdDelete />
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.cartSummary}>
            <h2 className={styles.total}>
              Total: {getTotal().toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
            </h2>

            <input
              type="text"
              placeholder="Dirección de envío"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className={styles.input}
            />

            <input
              type="text"
              placeholder="Teléfono de contacto"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={styles.input}
            />

            <button
              className={styles.payButton}
              onClick={handlePayment}
              disabled={loading || !direccion || !telefono}
            >
              {loading ? "Cargando..." : "Ir a pagar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
