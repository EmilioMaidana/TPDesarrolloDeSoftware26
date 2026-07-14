import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
    // Extraer el token de la cabecera Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Verificar y decodificar el token
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        
        // Inyectar los datos del usuario en la petición (ej: id, tipo)
        req.usuarioSeguro = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
}
