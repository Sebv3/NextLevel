import React from 'react';
import styles from './Footer.module.css';
import logo from "/src/assets/logo.png";

import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo + info */}
        <div className={styles.logoSection}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <p>© {new Date().getFullYear()} Mi Sitio. Todos los derechos reservados.</p>
        </div>

        {/* Enlaces útiles */}
        <div className={styles.linksSection}>
          <div>
            <h4>Enlaces</h4>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/juegos">Juegos</a></li>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/acerca">Acerca de</a></li>
            </ul>
          </div>

          {/* Redes sociales con íconos */}
          <div>
            <h4>Redes Sociales</h4>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
