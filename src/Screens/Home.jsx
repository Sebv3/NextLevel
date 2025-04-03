import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import styles from "./Home.module.css";


const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/images/carrusel1.png',  // Ruta correcta de las imágenes
    '/images/carrusel2.png'
  ];

  // Cambiar imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000 ms = 3 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.carruselContainer}>  {/* Aplica la clase desde styles */}
        <img
          src={images[currentImageIndex]}
          alt="Carrusel"
          className={styles.carruselImage}  
        />
      </div>
    </div>
  );
}

export default Home;