import React, { createContext, useState } from "react";

// Creamos el contexto
export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para agregar un juego al carrito
  const addToCart = (juego) => {
    setCart((prevCart) => {
      // Verificamos si el juego ya está en el carrito
      const existingItem = prevCart.find((item) => item.id === juego.id);

      if (existingItem) {
        // Si ya está en el carrito, incrementamos la cantidad
        return prevCart.map((item) =>
          item.id === juego.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        // Si es un nuevo producto, lo agregamos con cantidad 1
        return [...prevCart, { ...juego, cantidad: 1 }];
      }
    });
  };

  // Función para eliminar un juego del carrito
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  // Función para calcular el total
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
