import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Pago = () => {
  const [searchParams] = useSearchParams();
  const [mensaje, setMensaje] = useState("Verificando pago...");
  
  useEffect(() => {
    const token = searchParams.get("token_ws");

    if (token) {
      fetch(`http://127.0.0.1:8000/api/confirm_transaction/?token_ws=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setMensaje("✅ Pago realizado con éxito 🎉");
          } else {
            setMensaje("❌ Hubo un problema con la transacción.");
          }
        })
        .catch(error => {
          console.error("Error en la confirmación del pago:", error);
          setMensaje("❌ Error al procesar el pago.");
        });
    } else {
      setMensaje("❌ No se encontró un token de pago.");
    }
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{mensaje}</h1>
    </div>
  );
};

export default Pago;
