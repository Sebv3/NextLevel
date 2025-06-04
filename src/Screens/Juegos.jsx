import React, { useState, useEffect, useContext } from "react";
import styles from "./Juegos.module.css";
import { FaPlaystation, FaXbox, FaWindows } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { CartContext } from "../context/CartContext";
import Footer from '../Components/footer';
import { TbFilter } from "react-icons/tb";

const categoriasDecorativas = [
  { id: 1, nombre: "PlayStation", icono: <FaPlaystation /> },
  { id: 2, nombre: "Xbox", icono: <FaXbox /> },
  { id: 3, nombre: "PC", icono: <FaWindows /> },
  { id: 4, nombre: "Nintendo", icono: <BsNintendoSwitch /> },
];

const Juegos = () => {
  const [juegos, setJuegos] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/juegos/")
      .then((response) => response.json())
      .then((data) => setJuegos(data))
      .catch((error) => console.error("Error al cargar los juegos:", error));
  }, []);

  // Extrae nombres únicos de categorías desde los juegos
  const categorias = [
    ...new Set(
      juegos
        .filter(j => j.categoria !== null)
        .map(juego => juego.categoria.nombre)
    ),
  ];

  // Filtra los juegos por categoría seleccionada
  const juegosFiltrados = categoriaSeleccionada
    ? juegos.filter(juego => juego.categoria?.nombre === categoriaSeleccionada)
    : juegos;

  return (
    <>
      <div className={styles.container}>
        {/* Categorías decorativas */}
        <div className={styles.categories}>
          {categoriasDecorativas.map((categoria) => (
            <button key={categoria.id} className={styles.categoryButton}>
              {categoria.icono}
            </button>
          ))}
        </div>

        <h1 className={styles.title}>Juegos Disponibles</h1>

        {/* Filtro por categoría REAL */}
        <div className={styles.filterButtonContainer}>
          <button
            onClick={() => setMostrarCategorias(!mostrarCategorias)}
            className={styles.filterToggleButton}
          >
            {mostrarCategorias ? "Ocultar categorías" : "Filtrar por categoría"}
          </button>

          {mostrarCategorias && (
            <div className={styles.dropdown}>
              <div
                className={styles.dropdownItem}
                onClick={() => {
                  setCategoriaSeleccionada(null);
                  setMostrarCategorias(false);
                }}
              >
                Todas las categorías
              </div>
              {categorias.map((nombreCategoria, index) => (
                <div
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => {
                    setCategoriaSeleccionada(nombreCategoria);
                    setMostrarCategorias(false);
                  }}
                >
                  {nombreCategoria}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de juegos filtrados */}
        <div className={styles.grid}>
          {juegosFiltrados.map((juego) => (
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
