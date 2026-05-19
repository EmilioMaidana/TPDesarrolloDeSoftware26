import express from "express"
import turnoRouter from "./turnoRoutes.js"

const router = express.Router()

// Configuración de paths bases para cada recurso
router.use('/turnos', turnoRouter)

export default router