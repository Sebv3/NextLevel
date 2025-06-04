import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // Cargamos el carrito desde localStorage (si existe)
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Guardamos el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (juego) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === juego.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === juego.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prevCart, { ...juego, cantidad: 1 }];
      }
    });
  };

  const removeOneFromCart = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cantidad, 0);
  };

  const getPaymentData = () => {
    return {
      total: getCartTotal(),
      items: cart.map(({ id, nombre, precio, cantidad }) => ({
        id,
        nombre,
        precio,
        cantidad,
      })),
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeOneFromCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        getPaymentData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
