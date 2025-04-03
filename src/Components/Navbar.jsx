import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import styles from './Navbar.module.css';
import logo from "/src/assets/logo.png";

const Navbar = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [navBarOpen, setNavBarOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const searchRef = useRef(null);

    const links = [
        { id: 1, link: "Juegos", path: "/juegos" },
        { id: 2, link: "Categorias", path: "/categorias" },
        { id: 3, link: "Ofertas", path: "/ofertas" },
        { id: 4, link: "Nuevos", path: "/nuevos" }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchVisible(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className={styles.navBar}>
            <div className={styles.logo}>
                <img src={logo} alt="Logo NextLvL" className={styles.logoImg} />
            </div>

            <div className={styles.menuButton} onClick={() => setNavBarOpen(true)}>
                <AiOutlineMenu className={styles.menuIcon} />
            </div>

            <div className={`${styles.sideMenu} ${navBarOpen ? styles.open : ''}`}>
                <button className={styles.closeButton} onClick={() => setNavBarOpen(false)}>
                    <AiOutlineClose />
                </button>
                <ul>
                    {links.map((x) => (
                        <li key={x.id}>
                            <Link to={x.path} onClick={() => setNavBarOpen(false)}>{x.link}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.navContent}>
                <div className={`${styles.searchContainer} ${searchVisible ? styles.active : ''}`} ref={searchRef}>
                    <FiSearch className={styles.searchIcon} onClick={() => setSearchVisible(!searchVisible)} />
                    <input type="text" placeholder="Buscar..." className={styles.searchBar} />
                </div>
                <ul className={styles.navLinks}>
                    {links.map((x) => (
                        <li key={x.id}>
                            <Link to={x.path}>{x.link}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.profileContainer}>
                <Link to="/carrito" className={styles.cartIcon}>
                    <AiOutlineShoppingCart />
                </Link>
                <div className={styles.divider}></div>
                <FiUser className={styles.userIcon} onClick={() => setIsLoginOpen(true)} />
            </div>

            {/* Modal de inicio de sesión */}
            {isLoginOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeModal} onClick={() => setIsLoginOpen(false)}>&times;</button>
                        <h2>Iniciar Sesión</h2>
                        <input type="email" placeholder="Correo electrónico" />
                        <input type="password" placeholder="Contraseña" />
                        <button className={styles.btn}>Ingresar</button>
                        <p className={styles.linkText} onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}>
                            ¿No tienes cuenta? <span>Regístrate</span>
                        </p>
                        <p className={styles.linkText} onClick={() => { setIsLoginOpen(false); setIsForgotPasswordOpen(true); }}>
                            <span>¿Olvidaste tu contraseña?</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Modal de registro */}
            {isRegisterOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeModal} onClick={() => setIsRegisterOpen(false)}>&times;</button>
                        <h2>Registrarse</h2>
                        <input type="text" placeholder="Nombre de usuario" />
                        <input type="email" placeholder="Correo electrónico" />
                        <input type="tel" placeholder="Teléfono" />
                        <input type="password" placeholder="Contraseña" />
                        <input type="password" placeholder="Confirmar contraseña" />
                        <button className={styles.btn}>Registrarse</button>
                        <p className={styles.linkText} onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}>
                            ¿Ya tienes cuenta? <span>Iniciar sesión</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Modal de "Olvidaste tu contraseña" */}
            {isForgotPasswordOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeModal} onClick={() => setIsForgotPasswordOpen(false)}>&times;</button>
                        <h2 className={styles.recuperarletras}>Recuperar contraseña</h2>
                        <p className={styles.recuperarletras}>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
                        <input type="email" placeholder="Correo electrónico" />
                        <button className={styles.btn}>Enviar enlace</button>
                        <p className={styles.linkText} onClick={() => { setIsForgotPasswordOpen(false); setIsLoginOpen(true); }}>
                            <span>Volver a Iniciar sesión</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
