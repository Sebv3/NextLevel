import React, { useEffect, useState } from "react";
import styles from "./Perfil.module.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      fetch("http://127.0.0.1:8000/api/usuarios/me/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsuario(data);
          setCargando(false);
        })
        .catch((error) => {
          console.error("Error al obtener el usuario:", error);
          setCargando(false);
        });
    } else {
      setCargando(false);
    }
  }, []);

  if (cargando) return <p>Cargando perfil...</p>;
  if (!usuario) return <p>No se pudo obtener el perfil del usuario.</p>;

  return (
    <div className={styles["perfil-container"]}>
      <h1>Perfil del Usuario</h1>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Nombre de usuario:</strong> {usuario.username}</p>
      <p><strong>Teléfono:</strong> {usuario.telefono}</p>
    </div>

  );
};

export default Perfil;
