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

export default app