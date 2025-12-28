import React, { useState, useEffect } from "react";
import Layout from "../components/Layout"; 

// Imágenes estáticas (Iconos)
import iconEmail from "../assets/icon-email.svg";
import iconFacebook from "../assets/icon-facebook.svg";
import iconTelephone from "../assets/icon-telephone.svg";
import iconRegular from "../assets/regularcleaning.svg";
import iconDeep from "../assets/deepcleaning.svg";
import iconMoveIn from "../assets/movein.svg";

import "./Home.css";

// Interfaz para el tipo de dato que viene del backend
interface HomeImage {
  id: number;
  url: string;
}

export default function Home() {
  // --- ESTADO PARA LAS IMÁGENES ---
  const [images, setImages] = useState<HomeImage[]>([]);
  const [loading, setLoading] = useState(true);

  // --- EFECTO: CARGAR IMÁGENES DEL BACKEND ---
  useEffect(() => {
    // ⚠️ REEMPLAZA ESTO CON LA URL DE TU WORKER (ej: https://cleaningservice.tu-usuario.workers.dev)
    const BACKEND_URL = "https://TU-URL-DEL-BACKEND-AQUI.workers.dev"; 

    // Solo hacemos fetch si pusiste la URL, para evitar errores en local si no está lista
    if (BACKEND_URL !== "https://TU-URL-DEL-BACKEND-AQUI.workers.dev") {
      fetch(`${BACKEND_URL}/api/home-images`)
        .then((res) => {
          if (!res.ok) throw new Error("Error fetching images");
          return res.json();
        })
        .then((data) => {
          // Aseguramos que data sea un array (a veces D1 devuelve { results: [] })
          // @ts-ignore
          const imagesData = Array.isArray(data) ? data : data.results || [];
          setImages(imagesData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error cargando imágenes:", err);
          setLoading(false);
        });
    } else {
        // Si no hay URL configurada, quitamos el loading para mostrar el placeholder
        setLoading(false); 
    }
  }, []);

  return (
    <Layout>
      {/* MAIN CONTENT (HERO) */}
      <div className="content">
        <section className="left">
          <p className="quote">
            “A sparkling clean home is just one click away.”
          </p>

          <button className="cta">
            Get a Free Estimate
          </button>

          <div className="contact">
            <div className="contact-item">
              <img src={iconTelephone} alt="Phone" />
              <span>(860)-574-6290</span>
            </div>

            <div className="contact-item">
              <img src={iconTelephone} alt="Phone" />
              <span>(860)-574-2593</span>
            </div>

            <div className="contact-item">
              <img src={iconFacebook} alt="Facebook" />
              <a 
                href="https://www.facebook.com/profile.php?id=61562233474564" 
                target="_blank" 
                rel="noreferrer"
                className="link-facebook"
              >
                @H&amp;S Cleaning Services
              </a>
            </div>

            <div className="contact-item">
              <img src={iconEmail} alt="Email" />
              <a 
                href="mailto:h.s.cleaningservicesct@gmail.com"
                className="link-email"
              >
                h.s.cleaningservicesct@gmail.com
              </a>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: IMÁGENES DINÁMICAS */}
        <section className="right">
          <div className="image-collage">
            
            {loading && <p style={{textAlign: "center", padding: "20px"}}>Loading gallery...</p>}

            {!loading && images.length > 0 && (
              <div className="dynamic-grid">
                {images.map((img, index) => (
                  <img 
                    key={img.id} 
                    src={img.url} 
                    alt={`Work sample ${index + 1}`} 
                    className={`collage-img img-${index}`} 
                  />
                ))}
              </div>
            )}

            {!loading && images.length === 0 && (
               <div className="placeholder-box">
                  <p>No images uploaded yet</p>
               </div>
            )}

          </div>
        </section>
      </div>

      {/* SECTION: WHY CHOOSE US */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        
        <div className="features-list">
          <div className="feature-item">
            <span className="sparkle">✨</span>
            <span>Reliable and trusted cleaning team</span>
          </div>

          <div className="feature-item">
            <span className="sparkle">✨</span>
            <span>Flexible scheduling: weekly, bi-weekly, or occasional</span>
          </div>

          <div className="feature-item">
            <span className="sparkle">✨</span>
            <span>Affordable and efficient services</span>
          </div>
        </div>
      </section>

      {/* SECTION: FEATURED SERVICES */}
      <section className="services-section">
        <h2 className="section-title">Featured Services</h2>

        <div className="services-grid">
          {/* Card 1 */}
          <div className="service-card">
            <div className="icon-wrapper">
              <img src={iconRegular} alt="Regular Cleaning" />
            </div>
            <h3 className="service-name">Regular Cleaning</h3>
            <p className="service-desc">
              Basic maintenance cleaning for homes or offices. Ideal for weekly or bi-weekly upkeep.
            </p>
          </div>

          {/* Card 2 */}
          <div className="service-card">
            <div className="icon-wrapper">
              <img src={iconDeep} alt="Deep Cleaning" />
            </div>
            <h3 className="service-name">Deep Cleaning</h3>
            <p className="service-desc">
              A thorough, detailed cleaning that targets hidden dirt and buildup. Perfect for first-time cleanings or seasonal refresh.
            </p>
          </div>

          {/* Card 3 */}
          <div className="service-card">
            <div className="icon-wrapper">
              <img src={iconMoveIn} alt="Move In/Out Cleaning" />
            </div>
            <h3 className="service-name">Move In/Out Cleaning</h3>
            <p className="service-desc">
              Complete top-to-bottom cleaning for empty homes before or after moving. Helps ensure the place is spotless.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: WHERE WE WORK */}
      <section className="locations-section">
        <h2 className="section-title">Where we work?</h2>
        
        <div className="locations-container">
          <div className="locations-grid">
            <div className="location-column">
              <span>New London, CT</span>
              <span>Niantic, CT</span>
              <span>Clinton, CT</span>
              <span>Waterford, CT</span>
            </div>
            <div className="location-column">
              <span>Chester, CT</span>
              <span>Higganum, CT</span>
              <span>Killingworth, CT</span>
              <span>Madison, CT</span>
            </div>
            <div className="location-column">
              <span>Guilford, CT</span>
              <span>Branford, CT</span>
              <span>Ivoryton, CT</span>
              <span>East Lyme, CT</span>
            </div>
            <div className="location-column">
              <span>Old Lyme, CT</span>
              <span>Lyme, CT</span>
              <span>Old Saybrook, CT</span>
              <span>Westbrook, CT</span>
              <span>Groton, CT</span>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}