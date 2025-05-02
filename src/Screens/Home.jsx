import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/footer';
import styles from "./Home.module.css";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [juegos, setJuegos] = useState([]);
  const [startIndex, setStartIndex] = useState(0); // para el carrusel de juegos
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const mobileImages = ['/images/carrusel3.PNG', '/images/carrusel4.PNG'];

  const images = [
    '/images/carrusel1.png',
    '/images/carrusel2.png'
  ];



  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Traer juegos desde tu API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/juegos/")
      .then((res) => res.json())
      .then((data) => setJuegos(data))
      .catch((err) => console.error("Error al cargar juegos:", err));
  }, []);

  // Manejadores del carrusel de juegos
  const handleNext = () => {
    if (startIndex + 3 < juegos.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const juegosVisibles = juegos.slice(startIndex, startIndex + 3);

  return (
    <div>
      <Navbar />

      {/* Carrusel grande */}
      <div className={styles.carruselContainer}>
        <img
          src={isMobile ? mobileImages[currentImageIndex % mobileImages.length] : images[currentImageIndex]}
          alt="Carrusel"
          className={`${styles.carruselImage} ${styles.fadeIn}`}
        />
      </div>

      {/* Carrusel de juegos */}
      <div className={styles.juegosCarruselContainer}>
        <h2 className={styles.sectionTitle}>Recomendados</h2>

        {isMobile ? (
          <>
            <div className={styles.juegosCardsContainer}>
              {juegos.slice(0, 3).map((juego) => (
                <div key={juego.id} className={styles.juegoCard}>
                  <img src={juego.imagen} alt={juego.nombre} className={styles.juegoImagen} />
                  <h3 className={styles.juegoNombre}>{juego.nombre}</h3>
                </div>
              ))}
              <button className={styles.verMasButton}>Ver más</button>
            </div>

          </>
        ) : (
          <div className={styles.juegosCarrusel}>
            <button onClick={handlePrev} className={styles.carruselButton}>◀</button>

            <div className={styles.juegosCardsContainer}>
              {juegosVisibles.map((juego) => (
                <div key={juego.id} className={styles.juegoCard}>
                  <img src={juego.imagen} alt={juego.nombre} className={styles.juegoImagen} />
                  <h3 className={styles.juegoNombre}>{juego.nombre}</h3>
                </div>
              ))}
            </div>

            <button onClick={handleNext} className={styles.carruselButton}>▶</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
      
  );
};

export default Home;
