import { comparePassword } from "./utils/hash";
import { requireAuth } from "./utils/auth"; 
import { generateJWT } from "./utils/jwt";

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);

    // ---------------------------------------------------
    // RUTAS (ROUTER)
    // ---------------------------------------------------

    // 1. Login de administrador
    if (url.pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    // 2. Crear un nuevo lead (cliente potencial)
    if (url.pathname === "/api/leads" && request.method === "POST") {
      return createLeadHandler(request, env);
    }

    // 3. Obtener lista de leads (Protegido)
    if (url.pathname === "/api/leads" && request.method === "GET") {
      return getLeadsHandler(request, env);
    }

    // 4. Subir imagen para el Home (Protegido - POST)
    if (url.pathname === "/api/home-images" && request.method === "POST") {
      return uploadHomeImageHandler(request, env);
    }

    // 5. NUEVO: Obtener imágenes del Home (Protegido - GET)
    if (url.pathname === "/api/home-images" && request.method === "GET") {
      return getHomeImagesHandler(request, env);
    }

    // Si la ruta no existe
    return new Response("Not found", { status: 404 });
  },
};

// =========================================================
// HANDLERS (LÓGICA DE CADA RUTA)
// =========================================================

async function handleLogin(request: Request, env: any) {
  const { email, password } = await request.json();

  const stmt = await env.cleaningservice_db.prepare(
    "SELECT * FROM admin WHERE email = ?"
  ).bind(email);

  const admin = await stmt.first();

  if (!admin) {
    return new Response(JSON.stringify({ error: "Invalid login" }), {
      status: 401,
    });
  }

  const match = await comparePassword(password, admin.password_hash);

  if (!match) {
    return new Response(JSON.stringify({ error: "Invalid login" }), {
      status: 401,
    });
  }

  const token = await generateJWT({ id: admin.id, email: admin.email });

  return new Response(JSON.stringify({ token }), {
    headers: { "Content-Type": "application/json" },
  });
}

async function createLeadHandler(request: Request, env: any) {
  try {
    const { firstname, lastname, phone, email, city } = await request.json();

    if (!firstname || !lastname || !phone || !email) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const stmt = env.cleaningservice_db
      .prepare(
        "INSERT INTO leads (firstname, lastname, phone, email, city) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(firstname, lastname, phone, email, city ?? "");

    await stmt.run();

    console.log(" Lead saved:", firstname, lastname);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.log("ERROR SAVING LEAD:", err);
    return new Response(
      JSON.stringify({ error: "Server error", details: String(err) }),
      { status: 500 }
    );
  }
}

async function getLeadsHandler(request: Request, env: any) {
  console.log("Inside getLeadsHandler");

  const auth = await requireAuth(request, env);
  if (auth.error) return auth.response;

  const stmt = env.cleaningservice_db
    .prepare("SELECT * FROM leads ORDER BY id DESC");

  const results = await stmt.all();

  return new Response(
    JSON.stringify(results),
    { headers: { "Content-Type": "application/json" } }
  );
}

async function uploadHomeImageHandler(request: Request, env: any) {
  // --- PASO 1: Auth ---
  const auth = await requireAuth(request, env);
  if (auth.error) return auth.response;

  // --- PASO 2: Leer archivo ---
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(
      JSON.stringify({ error: "No file provided" }),
      { status: 400 }
    );
  }

  // --- PASO 3: Validación (Máximo 5 imágenes) ---
  const countRow = await env.cleaningservice_db
    .prepare("SELECT COUNT(*) AS count FROM home_images")
    .first();
  
  const count = Number(countRow?.count ?? 0);
  
  if (count >= 5) {
    return new Response(
      JSON.stringify({ error: "Maximum of 5 home images allowed" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- PASO 4: Preparar subida a R2 ---
  const extension = file.name.split(".").pop();
  const filename = `home/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = await file.arrayBuffer();

  // --- PASO 5: Subir a R2 ---
  await env.R2_BUCKET.put(filename, buffer, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  // --- PASO 6: Construir URL Pública ---
  const PUBLIC_R2_URL = "https://pub-cleaningservice-images-dev.r2.dev";
  const publicUrl = `${PUBLIC_R2_URL}/${filename}`;

  // --- PASO 7: Guardar referencia en Base de Datos (D1) ---
  //  Esto actualiza la tabla y hará que el contador suba la próxima vez
  await env.cleaningservice_db
    .prepare("INSERT INTO home_images (url) VALUES (?)")
    .bind(publicUrl)
    .run();

  // --- PASO 8: Responder al cliente ---
  return new Response(
    JSON.stringify({
      success: true,
      url: publicUrl,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

// ---------------------------------------------------------
// NUEVO HANDLER: GET HOME IMAGES (Listar imágenes)
// ---------------------------------------------------------
// En index.ts

async function getHomeImagesHandler(request: Request, env: any) {
  // 1. ELIMINAMOS LA VERIFICACIÓN DE AUTH AQUÍ
  // Queremos que cualquier visitante pueda ver las fotos.
  
  // 2. Consultamos las imágenes (solo url)
  // Cloudflare D1 .all() devuelve un objeto { results: [] }
  const { results } = await env.cleaningservice_db
    .prepare("SELECT id, url FROM home_images ORDER BY id DESC")
    .all();

  // 3. Devolvemos la lista limpia
  return new Response(JSON.stringify(results), {
    headers: { 
      "Content-Type": "application/json",
      // Importante: Permitir que el frontend acceda (CORS)
      "Access-Control-Allow-Origin": "*" 
    },
  });
}