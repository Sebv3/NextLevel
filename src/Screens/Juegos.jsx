import React, { useState, useEffect, useContext } from "react";
import styles from "./Juegos.module.css";
import { FaPlaystation, FaXbox, FaWindows } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { TbFilter } from "react-icons/tb";
import { CartContext } from "../context/CartContext";
import Footer from '../Components/footer';

// Botones de plataformas fijos con íconos — sin funcionalidad aún
const plataformas = [
  { id: 1, nombre: "PlayStation", icono: <FaPlaystation /> },
  { id: 2, nombre: "Xbox", icono: <FaXbox /> },
  { id: 3, nombre: "PC", icono: <FaWindows /> },
  { id: 4, nombre: "Nintendo", icono: <BsNintendoSwitch /> },
];

const Juegos = () => {
  const [juegos, setJuegos] = useState([]);
  const { addToCart } = useContext(CartContext);

  const [categorias, setCategorias] = useState([]);

  const [mostrarFiltroCategorias, setMostrarFiltroCategorias] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [error, setError] = useState(null);

  // Carga los juegos
  const cargarJuegos = (categoriaId = null) => {
    let url = "http://127.0.0.1:8000/api/juegos/";
    if (categoriaId) {
      url += `?categoria=${categoriaId}`;
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar juegos");
        return res.json();
      })
      .then((data) => {
        setJuegos(data);
        setError(null);
      })
      .catch(() => setError("No se pudo cargar los juegos"));
  };

  // Carga categorías desde backend para filtro
  const cargarCategorias = () => {
    fetch("http://127.0.0.1:8000/api/categorias/")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar categorías");
        return res.json();
      })
      .then((data) => {
        setCategorias(data);
        setError(null);
      })
      .catch(() => setError("No se pudo cargar las categorías"));
  };

  useEffect(() => {
    cargarJuegos();
    cargarCategorias();
  }, []);

  const filtrarPorCategoria = (id) => {
    setCategoriaSeleccionada(id);
    cargarJuegos(id);
    setMostrarFiltroCategorias(false);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Juegos Disponibles</h1>

        <div className={styles.categories}>
          {plataformas.map((plat) => (
            <button key={plat.id} className={styles.categoryButton}>
              {plat.icono}
            </button>
          ))}
        </div>

        {/* Boton para mostrar filtro por categorias */}
        <div className={styles.filterWrapper}>
          <button
            onClick={() => setMostrarFiltroCategorias(!mostrarFiltroCategorias)}
            className={styles.filterToggleButton}
          >
            <TbFilter size={20} style={{ marginRight: 8 }} />
            Filtrar
          </button>

          {mostrarFiltroCategorias && (
            <div className={styles.dropdown}>
              <div
                className={styles.dropdownItem}
                style={{
                  fontWeight: categoriaSeleccionada === null ? "bold" : "normal",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCategoriaSeleccionada(null);
                  cargarJuegos(); // Sin filtro
                  setMostrarFiltroCategorias(false);
                }}
              >
                Ver todos
              </div>

              {categorias.length > 0 ? (
                categorias.map((cat) => (
                  <div
                    key={cat.id}
                    className={styles.dropdownItem}
                    style={{
                      fontWeight: cat.id === categoriaSeleccionada ? "bold" : "normal",
                      cursor: "pointer",
                    }}
                    onClick={() => filtrarPorCategoria(cat.id)}
                  >
                    {cat.nombre}
                  </div>
                ))
              ) : (
                <div className={styles.dropdownItem}>No hay categorías</div>
              )}
            </div>
          )}

        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Mostrar juegos filtrados */}
        <div className={styles.grid}>
          {juegos.map((juego) => (
            <div key={juego.id} className={styles.card}>
              <img src={juego.imagen} alt={juego.nombre} className={styles.image} />
              <h2 className={styles.name}>{juego.nombre}</h2>
              <p className={styles.price}>
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(juego.precio)}
              </p>
              <button className={styles.button} onClick={() => addToCart(juego)}>
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
