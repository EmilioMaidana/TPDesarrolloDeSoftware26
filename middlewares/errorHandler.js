import { AppError } from "../errors/AppErrors.js"

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            timestamp: err.timestamp,
        })
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            status: "fail",
            message: "ID proporcionado no es válido para MongoDB",
            timestamp: new Date().toISOString(),
        })
    }

    return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
        timestamp: new Date().toISOString(),
    })
}