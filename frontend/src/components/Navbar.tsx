import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <a className="nav-item active" href="/">Home</a>
      <a className="nav-item" href="/about">About Us</a>
      <a className="nav-item" href="/services">Services</a>
      <a className="nav-item" href="/contact">Contact</a>
    </nav>
  );
}