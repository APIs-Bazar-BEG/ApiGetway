// server.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configuración de servicios desde variables de entorno
const CLIENTE_API = process.env.CLIENTE_API || "http://localhost:3000";
const PAGOS_API = process.env.PAGOS_API || "http://localhost:3001";

// ----------------------
// API CLIENTES
// ----------------------
app.use(
  "/api/clientes",
  createProxyMiddleware({
    target: CLIENTE_API,
    changeOrigin: true,
    pathRewrite: {
      "^/api/clientes": "/api/v1", // elimina /api/clientes y agrega /api/v1 para la API cliente
    },
  })
);

// ----------------------
// API PAGOS
// ----------------------
// Rutas hacia la API de pagos
app.use(
  "/api/pagos",
  createProxyMiddleware({
    target: PAGOS_API,
    changeOrigin: true,
    pathRewrite: { "^/api/pagos": "" },
    proxyTimeout: 30000, // 30 segundos máximo de espera
    timeout: 30000,
    onError: (err, req, res) => {
      console.error("Error en proxy de pagos:", err.message);
      res.status(500).json({ error: "Error al conectar con API de pagos" });
    },
  })
);

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.json({ message: "API Gateway activo 🚀" });
});

// Escuchar en el puerto definido en .env
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
