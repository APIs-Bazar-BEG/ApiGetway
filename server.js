// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ----------------------
// Variables de entorno
// ----------------------
const CLIENTE_API = process.env.CLIENTE_API;
const PAGOS_API = process.env.PAGOS_API;
const ADMIN_API = process.env.ADMIN_API;
const LOGIN_API = process.env.LOGIN_API;

// ----------------------
// Middleware para parsing JSON
// ----------------------
app.use(express.json());

// ----------------------
// API CLIENTES
// ----------------------
app.use(
  "/api/clientes",
  createProxyMiddleware({
    target: CLIENTE_API,
    changeOrigin: true,
    pathRewrite: {
      "^/api/clientes": "", // elimina /api/clientes, pasa directo a la API real
    },
    onError: (err, req, res) => {
      console.error("Error proxy clientes:", err.message);
      res.status(500).json({ error: "No se pudo conectar con la API de clientes" });
    },
  })
);

// ----------------------
// API PAGOS
// ----------------------
app.use(
  "/api/pagos",
  createProxyMiddleware({
    target: PAGOS_API,
    changeOrigin: true,
    pathRewrite: { "^/api/pagos": "" },
    onError: (err, req, res) => {
      console.error("Error proxy pagos:", err.message);
      res.status(500).json({ error: "No se pudo conectar con la API de pagos" });
    },
  })
);

// ----------------------
// API ADMIN
// ----------------------
app.use(
  "/api/admin",
  createProxyMiddleware({
    target: ADMIN_API,
    changeOrigin: true,
    pathRewrite: { "^/api/admin": "" },
    onError: (err, req, res) => {
      console.error("Error proxy admin:", err.message);
      res.status(500).json({ error: "No se pudo conectar con la API de admin" });
    },
  })
);

// ----------------------
// API LOGIN
// ----------------------
app.use(
  "/api/login",
  createProxyMiddleware({
    target: LOGIN_API,
    changeOrigin: true,
    pathRewrite: { "^/api/login": "" },
    onError: (err, req, res) => {
      console.error("Error proxy login:", err.message);
      res.status(500).json({ error: "No se pudo conectar con la API de login" });
    },
  })
);

// ----------------------
// Ruta raíz de prueba
// ----------------------
app.get("/", (req, res) => {
  res.json({ message: "API Gateway activo 🚀" });
});

// ----------------------
// Levantar el servidor
// ----------------------
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
