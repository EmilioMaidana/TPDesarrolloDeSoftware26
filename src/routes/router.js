import { Router } from "express";
const router = Router();

// aca tienen que ir nuestras rutas

router.get('/health', (req, res) => {
    req = console.log("Alguien esta intentando consultar por la salud de nuestra epica app B)")
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'La API está funcionando correctamente.'
    });
});


export default router;
