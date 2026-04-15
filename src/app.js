// src/app.js
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que Express entienda JSON en el body de las peticiones
app.use(express.json());

// Endpoint /health ---
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        message: 'La API está funcionando correctamente.'
    });
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Health check disponible en http://localhost:${PORT}/health`);
});