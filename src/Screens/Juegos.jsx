import React, { useState, useEffect, useContext } from "react";
import styles from "./Juegos.module.css";
import { FaPlaystation, FaXbox, FaWindows } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { CartContext } from "../context/CartContext"; // Importamos el contexto

const categorias = [
  { id: 1, nombre: "PlayStation", icono: <FaPlaystation /> },
  { id: 2, nombre: "Xbox", icono: <FaXbox /> },
  { id: 3, nombre: "PC", icono: <FaWindows /> },
  { id: 4, nombre: "Nintendo", icono: <BsNintendoSwitch /> },
];

const Juegos = () => {
  const [juegos, setJuegos] = useState([]); // Para almacenar los juegos obtenidos
  const { addToCart } = useContext(CartContext); // Usamos el contexto

  useEffect(() => {
    // Hacemos la solicitud para obtener los juegos desde la API de Django
    fetch("http://127.0.0.1:8000/api/juegos/") // La URL de la API que creaste
      .then((response) => response.json())
      .then((data) => setJuegos(data)) // Al recibir los datos, los guardamos en el estado
      .catch((error) => console.error("Error al cargar los juegos:", error)); // Manejamos el error
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        {categorias.map((categoria) => (
          <button key={categoria.id} className={styles.categoryButton}>
            {categoria.icono}
          </button>
        ))}
      </div>

      <h1 className={styles.title}>Juegos Disponibles</h1>

      <div className={styles.grid}>
        {juegos.map((juego) => (
          <div key={juego.id} className={styles.card}>
            <img
              src={juego.imagen}
              alt={juego.nombre}
              className={styles.image}
            />
            <h2 className={styles.name}>{juego.nombre}</h2>
            <p className={styles.price}>
              {new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP", // Esto especifica la moneda como pesos chilenos
              }).format(juego.precio)}
            </p>
            <button
              className={styles.button}
              onClick={() => addToCart(juego)} // Añadimos al carrito
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Juegos;
