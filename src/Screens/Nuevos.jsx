import React, { useState } from 'react';
import styles from './Nuevos.module.css';

const Nuevos = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    imagen: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      imagen: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, precio, imagen } = formData;

    if (!nombre || !precio || !imagen) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const data = new FormData();
    data.append('nombre', nombre);
    data.append('precio', precio);
    data.append('imagen', imagen);

    try {
      const response = await fetch('http://localhost:8000/api/juegos/', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('Producto agregado exitosamente');
      } else {
        alert('Hubo un error al agregar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar los datos');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre del Producto</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre del producto"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="precio">Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleInputChange}
            placeholder="Precio"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="imagen">Imagen del Producto</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Agregar Producto
        </button>
      </form>
    </div>
  );
};

export default Nuevos;
