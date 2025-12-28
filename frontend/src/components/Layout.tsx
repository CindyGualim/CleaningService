import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import logo from "../assets/logo.png";
import iconUp from "../assets/icons-up.svg"; 
import "./Layout.css";

export default function Layout({ children }: any) {
  
  // 1. ESTADO: Controla si el botón se ve o no. Empieza en 'false' (Oculto).
  const [showButton, setShowButton] = useState(false);

  // 2. EFECTO: Vigila el scroll del usuario
  useEffect(() => {
    const handleScroll = () => {
      // Si el usuario baja más de 300px, cambiamos el estado a 'true' (Visible)
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Activamos el "espía" del scroll
    window.addEventListener("scroll", handleScroll);

    // Limpieza: Quitamos el espía si cambiamos de página
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Función para subir al inicio
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="layout-container">
      {/* FONDO DE BURBUJAS */}
      <div className="bubbles-container">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      <header className="header">
        <img src={logo} alt="H&S Cleaning Service" className="logo" />
        <h1 className="title">H&amp;S Cleaning Service LLC</h1>
      </header>

      <Navbar />

      <main>
        {children}
      </main>

      {/* BOTÓN GLOBAL DE SUBIR */}
      {/* Se mostrará SOLO si showButton es true */}
      <button 
        className={`scroll-top-btn ${showButton ? "visible" : ""}`} 
        onClick={scrollToTop}
      >
        <img src={iconUp} alt="Scroll to top" />
      </button>

    </div>
  );
}