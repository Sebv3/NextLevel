import React, { useEffect, useState } from "react";
import styles from "./Pago.module.css";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Phone,
  ShoppingCart,
} from "lucide-react";


const Pago = () => {
  const [searchParams] = useSearchParams();
  const [mensaje, setMensaje] = useState("Verificando pago...");
  const [pedido, setPedido] = useState(null);
  const [estado, setEstado] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token_ws");

    if (token) {
      fetch(`http://127.0.0.1:8000/api/confirm_transaction/?token_ws=${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "AUTHORIZED") {
            setMensaje("Pago realizado con éxito");
            setPedido(data.pedido);
            setEstado("success");
          } else if (data.error) {
            setMensaje("Error: " + data.error);
            setEstado("error");
          } else {
            setMensaje("Hubo un problema con la transacción.");
            setEstado("error");
          }
        })
        .catch((error) => {
          console.error("Error en la confirmación del pago:", error);
          setMensaje("Error al procesar el pago.");
          setEstado("error");
        });
    } else {
      setMensaje("No se encontró un token de pago.");
      setEstado("error");
    }
  }, [searchParams]);

  const renderIcon = () => {
    if (estado === "loading") return <Loader2 className="animate-spin text-blue-500" size={48} />;
    if (estado === "success") return <CheckCircle className="text-green-600" size={48} />;
    return <XCircle className="text-red-600" size={48} />;
  };

  return (
    <div className={styles["pago-container"]}>
      <div className={styles["pago-card"]}>
        <div
          className={`${styles["pago-header"]} ${estado === "success"
              ? styles["pago-header-success"]
              : estado === "error"
                ? styles["pago-header-error"]
                : styles["pago-header-loading"]
            }`}
        >
          {renderIcon()}
          <h1 className={styles["pago-mensaje"]}>{mensaje}</h1>
        </div>

        {pedido && (
          <div className={styles["pago-resumen"]}>
            <h2>
              <ShoppingCart size={20} /> Resumen del pedido
            </h2>
            <p className={styles["pago-info"]}>
              <MapPin size={18} />
              <strong>Dirección:</strong> {pedido.direccion_envio}
            </p>
            <p className={styles["pago-info"]}>
              <Phone size={18} />
              <strong>Teléfono:</strong> {pedido.telefono_contacto}
            </p>
            <p className={styles["pago-total"]}>
              💰 <strong>Total:</strong>{" "}
              {pedido.total.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </p>

            <h3 className={styles["pago-productos"]}>🛒 Productos:</h3>
            <ul className={styles["pago-productos"]}>
              {pedido.productos.map((prod, index) => (
                <li key={index}>
                  <strong>{prod.nombre}</strong> — {prod.cantidad} x{" "}
                  {prod.precio.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

};

export default Pago;
