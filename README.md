# H-ScleaningService
#  Backend - Cleaning Service API

Este proyecto es el núcleo del sistema, desarrollado con un enfoque **Serverless** utilizando el ecosistema de Cloudflare.

---

##  Tecnologías Utilizadas

* **Cloudflare Workers**: Entorno de ejecución para el API serverless.
* **Wrangler**: Herramienta de línea de comandos (CLI) para desarrollo y despliegue.
* **D1 Database**: Base de datos relacional nativa de Cloudflare (basada en SQLite).
* **R2 Object Storage**: Almacenamiento de archivos y fotos (alternativa a AWS S3).
* **JWT (JSON Web Tokens)**: Estándar para la autenticación segura.
* **bcryptjs**: Librería para el cifrado (hashing) de contraseñas.
* **TypeScript**: Superconjunto de JavaScript que añade tipado estático para evitar errores.

---

##  Autenticación

El sistema de seguridad implementa **Bearer Tokens**.

1.  El administrador inicia sesión en `/api/login`.
2.  El servidor genera un **token JWT**.
3.  Para acceder a rutas protegidas, el cliente debe enviar el token en el encabezado:
    `Authorization: Bearer <token>`
4.  El middleware `requireAuth` se encarga de validar que el token sea legítimo antes de procesar la solicitud.

---

##  Endpoints Disponibles

###  Login de Administrador
* **Ruta**: `POST /api/login`
* **Cuerpo (JSON)**:
    ```json
    {
      "email": "admin@empresa.com",
      "password": "Admin123!"
    }
    ```
* **Respuesta Exitosa**:
    ```json
    {
      "token": "jwt_token_aqui"
    }
    ```

###  Leads (Clientes Potenciales)
* **Crear Lead**: `POST /api/leads` (Público)
    ```json
    {
      "firstname": "Juan",
      "lastname": "Pérez",
      "phone": "5555-5555",
      "email": "juan@example.com",
      "city": "Guatemala"
    }
    ```
* **Obtener Leads**: `GET /api/leads` (**Protegido**)

###  Imágenes del Home
* **Subir Imagen**: `POST /api/home-images` (**Protegido**)
    * **Tipo**: `multipart/form-data`
    * **Campo**: `file`
    * **Nota**: Máximo 5 imágenes. Sube a R2 y guarda la URL en D1.
* **Listar Imágenes**: `GET /api/home-images` (**Protegido**)

---

##  Estructura de Base de Datos (D1)

| Tabla | Columnas |
| :--- | :--- |
| **admin** | `id`, `email`, `password_hash` |
| **leads** | `id`, `firstname`, `lastname`, `phone`, `email`, `city`, `created_at` |
| **home_images** | `id`, `url`, `uploaded_at` |

---

##  Desarrollo Local

Para levantar el entorno de desarrollo:
1. Entrar a la carpeta: `cd backend`
2. Ejecutar: `npx wrangler dev`

> **Nota**: La base de datos local y el almacenamiento son gestionados automáticamente por **Miniflare**.

---

##  Estado del Proyecto

- [x] Login de administrador.
- [x] CRUD básico de leads.
- [x] Subida de imágenes a R2.
- [x] Límite de 5 imágenes para el Home.
- [x] Listado de imágenes del Home.