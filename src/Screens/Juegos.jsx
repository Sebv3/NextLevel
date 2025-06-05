import React, { useState, useEffect, useContext } from "react";
import styles from "./Juegos.module.css";
import { FaPlaystation, FaXbox, FaWindows } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { TbFilter } from "react-icons/tb";
import { CartContext } from "../context/CartContext";
import Footer from '../Components/footer';

const categorias = [
  { id: 1, nombre: "PlayStation", icono: <FaPlaystation /> },
  { id: 2, nombre: "Xbox", icono: <FaXbox /> },
  { id: 3, nombre: "PC", icono: <FaWindows /> },
  { id: 4, nombre: "Nintendo", icono: <BsNintendoSwitch /> },
];

const Juegos = () => {
  const [juegos, setJuegos] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/juegos/")
      .then((response) => response.json())
      .then((data) => setJuegos(data))
      .catch((error) => console.error("Error al cargar los juegos:", error));
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Juegos Disponibles</h1>

        <div className={styles.filterWrapper}>
          <button
            onClick={() => setMostrarCategorias(!mostrarCategorias)}
            className={styles.filterToggleButton}
          >
            <TbFilter size={20} style={{ marginRight: 8 }} />
            Categorías
          </button>

          {mostrarCategorias && (
            <div className={styles.dropdown}>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <div key={categoria.id} className={styles.dropdownItem}>
                    {categoria.icono}
                    <span>{categoria.nombre}</span>
                  </div>
                ))
              ) : (
                <div className={styles.dropdownItem}>No existen categorías</div>
              )}
            </div>
          )}
        </div>

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
                  currency: "CLP",
                }).format(juego.precio)}
              </p>
              <button
                className={styles.button}
                onClick={() => addToCart(juego)}
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Juegos;
