import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Importamos Link de react-router-dom
import { FiSearch, FiUser } from 'react-icons/fi';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import styles from './Navbar.module.css';
import logo from "/src/assets/logo.png";

const Navbar = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [navBarOpen, setNavBarOpen] = useState(false);
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
            
            <div className={styles.profileIcon}>
                <FiUser className={styles.userIcon} />
            </div>
        </div>
    );
};

export default Navbar;
