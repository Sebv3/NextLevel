import React, { useContext } from "react";
import styles from "./Juegos.module.css";
import juegosData from "../data/juegosData";
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
  const { addToCart } = useContext(CartContext); // Usamos el contexto

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
        {juegosData.map((juego) => (
          <div key={juego.id} className={styles.card}>
            <img src={juego.imagen} alt={juego.nombre} className={styles.image} />
            <h2 className={styles.name}>{juego.nombre}</h2>
            <p className={styles.price}>${juego.precio.toLocaleString("es-CL")}</p>
            <button className={styles.button} onClick={() => addToCart(juego)}>
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Juegos;
