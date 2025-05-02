import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import styles from './Navbar.module.css';
import logo from "/src/assets/logo.png";
import { CartContext } from '../context/CartContext';



const Navbar = () => {
    const { cart } = useContext(CartContext);
    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
    const [searchVisible, setSearchVisible] = useState(false);
    const [navBarOpen, setNavBarOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const searchRef = useRef(null);

    const links = [
        { id: 1, link: "Inicio", path: "/" },
        { id: 2, link: "Juegos", path: "/juegos" },
        { id: 3, link: "Categorias", path: "/categorias" },
        { id: 4, link: "Ofertas", path: "/ofertas" },
        { id: 5, link: "Nuevos", path: "/nuevos" }
    ];

    const [registroData, setRegistroData] = useState({
        username: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });


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
                    {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
                </Link>
                <div className={styles.divider}></div>
                <FiUser className={styles.userIcon} onClick={() => setIsLoginOpen(true)} />
            </div>

            {/* Modal de inicio de sesión */}
            {isLoginOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeModal} onClick={() => setIsLoginOpen(false)}>&times;</button>

                        {/* Logo en el modal */}
                        <div className={styles.modalLogo}>
                            <img src={logo} alt="Logo" className={styles.logoImg} />
                        </div>

                        <h2 className={styles.modalTitle}>Iniciar Sesión</h2> {/* Título del modal */}
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <button
                            className={styles.btn}
                            onClick={async () => {
                                try {
                                    const response = await fetch('http://localhost:8000/api/token/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            email: loginData.email, 
                                            password: loginData.password
                                        }),
                                    });

                                    const data = await response.json();

                                    if (response.ok) {
                                        localStorage.setItem('access', data.access);
                                        localStorage.setItem('refresh', data.refresh);
                                        localStorage.setItem('is_staff', data.is_staff); 
                                        localStorage.setItem('username', data.username);

                                        alert('Inicio de sesión exitoso');
                                        setIsLoginOpen(false);

                                        
                                    } else {
                                        alert('Error de autenticación');
                                    }
                                } catch (error) {
                                    alert('Error al conectar con el servidor');
                                }
                            }}
                        >
                            Ingresar
                        </button>
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

                        {/* Logo en el modal */}
                        <div className={styles.modalLogo}>
                            <img src={logo} alt="Logo" className={styles.logoImg} />
                        </div>

                        <h2 className={styles.modalTitle}>Registrarse</h2> {/* Título del modal */}
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={registroData.username}
                            onChange={(e) => setRegistroData({ ...registroData, username: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={registroData.email}
                            onChange={(e) => setRegistroData({ ...registroData, email: e.target.value })}
                        />
                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={registroData.telefono}
                            onChange={(e) => setRegistroData({ ...registroData, telefono: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={registroData.password}
                            onChange={(e) => setRegistroData({ ...registroData, password: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={registroData.confirmPassword}
                            onChange={(e) => setRegistroData({ ...registroData, confirmPassword: e.target.value })}
                        />
                        <button
                            className={styles.btn}
                            onClick={async () => {
                                if (registroData.password !== registroData.confirmPassword) {
                                    alert('Las contraseñas no coinciden');
                                    return;
                                }

                                try {
                                    const response = await fetch('http://localhost:8000/api/register/', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            username: registroData.username,
                                            email: registroData.email,
                                            password: registroData.password,
                                            telefono: registroData.telefono,
                                        }),
                                    });

                                    if (response.ok) {
                                        alert('Registro exitoso');
                                        setIsRegisterOpen(false);
                                        setIsLoginOpen(true); // abre login
                                    } else {
                                        const errorData = await response.json();
                                        alert('Error en el registro: ' + JSON.stringify(errorData));
                                    }
                                } catch (error) {
                                    alert('Error de red: ' + error.message);
                                }
                            }}
                        >
                            Registrarse
                        </button>
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

                        {/* Logo en el modal */}
                        <div className={styles.modalLogo}>
                            <img src={logo} alt="Logo" className={styles.logoImg} />
                        </div>

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
