// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/router.js"
// para correr por primera vez y que no de problemas, chequear que las librerias esten instaladas correctamente
// errores del tipo MODULE NOT FOUND 
// npm install cors dotenv express
//para correr npm run start(si no funca mandale un node app.js y fue. O te podes fijar en el package.json)
// para tests instalar jest: npm install --save-dev jest
//npm install --save-dev babel-jest @babel/core @babel/preset-env instalar esto para que jest ande con la forma module

dotenv.config()


const app = express();
const PORT = process.env.PORT || 43123; //como tenemos el archivo .env y declaramos el dotenv.config() levanta el puerto desde el .env y no el 43123

// Permite que Express entienda JSON en el body de las peticiones
app.use(express.json());

app.use('/api', router);
// Endpoint /api/health en router


// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Health check disponible en http://localhost:${PORT}/api/health`);
});
/*

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

*/

app.post('/api/turnos', (req, res) => {
    try {
        //const body = req.body;
        const { 
            medicoId, 
            pacienteId, 
            fechaHora, 
            sedeId, 
            servicio,
            estado = "RESERVADO" 
        } = req.body;
        
        const result = productSchema.safeParse(body);
        if (result.error) {
            res.status(400);
            res.json(result.error.issues);
        }
        
        const medico = buscarMedicoPorId(medicoId);
        const paciente = buscarPacientePorId(pacienteId);

         if (medico === NULL || paciente === NULL) {
            return res.status(404).json({
                success: false,
                message: 'Médico o paciente no encontrado'
            });
        }
        
        // Crear turno
        const nuevoTurno = new Turno(
            medico,
            paciente,
            fechaHora,
            sedeId,
            servicio,
            estado,
            [],
            calcularCosto(servicio, medico, paciente)
        );
        
        res.status(201).json({
            success: true,
            message: 'Turno creado exitosamente',
            data: nuevoTurno
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el turno',
            error: error.message
        });
    }
});

function buscarMedicoPorId(id) {
    return listaDeMedicos.find(m => m.id === id);
}

function buscarPacientePorId(id) {
    return listaDePacientes.find(p => p.id === id);
}

export default app
