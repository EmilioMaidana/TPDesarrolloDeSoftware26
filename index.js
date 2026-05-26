import "dotenv/config";

import { MongoDBClient } from "./config/database.js";
import { EspecialidadModel } from "./schemas/EspecialidadSchema.js";
import { PlanModel } from "./schemas/PlanSchema.js";
import { ObraSocialModel } from "./schemas/ObraSocialSchema.js";
import { PacienteModel } from "./schemas/PacienteSchema.js";
import { UsuarioModel } from "./schemas/UsuarioSchema.js";
import { MedicoModel } from "./schemas/MedicoSchema.js";
import { TurnoModel } from "./schemas/TurnoSchema.js";


async function main() {

  try {

    // CONECTAR MONGO
    await MongoDBClient.connect();

    console.log("Mongo conectado");


    // =========================
    // ESPECIALIDAD
    // =========================

    const cardiologia =
    await EspecialidadModel.create({

      nombre: "Cardiologia",

      duracionTurnoEnMins: 30,

      costoConsulta: 5000,

    });

    console.log("Especialidad creada");


    // =========================
    // PLAN
    // =========================

    const plan =
    await PlanModel.create({

      nombre: "Plan Oro",

    });

    console.log("Plan creado");


    // =========================
    // OBRA SOCIAL
    // =========================

    const obraSocial =
    await ObraSocialModel.create({

      nombre: "OSDE",

      planes: [plan._id],

    });

    console.log("Obra social creada");


    // =========================
    // USUARIO
    // =========================

    const usuarioMedico =
    await UsuarioModel.create({

      nombreUsuario: "doctor1",

      password: "1234",

    });

    console.log("Usuario creado");


    // =========================
    // MEDICO
    // =========================

    const medico =
    await MedicoModel.create({

      usuario: usuarioMedico._id,

      matricula: "MAT-123",

      nombre: "Dr House",

      especialidades: [cardiologia._id],

      practicas: [],

      sedes: [],

      disponibilidades: [],

    });

    console.log("Medico creado");


    // =========================
    // PACIENTE
    // =========================

    const paciente =
    await PacienteModel.create({

      dni: "12345678",

      nombre: "Juan Perez",

      obraSocial: obraSocial._id,

      plan: plan._id,

    });

    console.log("Paciente creado");


    // =========================
    // TURNO
    // =========================

    const turno =
    await TurnoModel.create({

      medico: medico._id,

      paciente: paciente._id,

      fechaHora: new Date(),

      servicio: cardiologia._id,

      servicioTipo: "Especialidad",

      estado: "RESERVADO",

      historialEstados: [{
        estado: "RESERVADO",
        usuario: usuarioMedico._id,
        motivo: "Reserva inicial",
      }],

      costo: 5000,

    });

    console.log("Turno creado");


    // =========================
    // HISTORIAL PACIENTE
    // =========================

    const historial =
    await TurnoModel.find({

      paciente: paciente._id,

    })
    .populate("medico")
    .populate("paciente")
    .populate("servicio");


    console.log("\n=== HISTORIAL ===");

    console.log(
      JSON.stringify(historial, null, 2)
    );


  } catch (error) {

    console.error(error);

  }

}

main();