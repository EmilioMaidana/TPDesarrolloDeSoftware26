/**
 * Test de integración de la capa de Controladores (Entrega 4).
 *
 * Levanta la app de Express con supertest y la ejecuta contra una base de datos
 * Mongo real pero AISLADA (una base de test que se borra al terminar). Verifica
 * el camino completo controller -> service -> repository -> Mongo del endpoint de
 * búsqueda de turnos, incluyendo el cálculo de cobertura.
 *
 * Necesita un MongoDB accesible. Por defecto usa el mismo servidor de la app
 * (127.0.0.1:27018) pero en la base "SweetMedical_inttest". Se puede sobrescribir
 * con la variable de entorno MONGODB_TEST_URI.
 */
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../app.js";
import "../../schemas/registerModels.js";
import { EspecialidadModel } from "../../schemas/especialidadSchema.js";
import { PlanModel } from "../../schemas/planSchema.js";
import { ObraSocialModel } from "../../schemas/obraSocialSchema.js";
import { UsuarioModel } from "../../schemas/usuarioSchema.js";
import { MedicoModel } from "../../schemas/medicoSchema.js";
import { PacienteModel } from "../../schemas/pacienteSchema.js";
import { TurnoModel } from "../../schemas/turnoSchema.js";
import { EstadoTurno, NivelCobertura } from "../../domain/Enums.js";

const TEST_URI =
  process.env.MONGODB_TEST_URI || "mongodb://127.0.0.1:27018/SweetMedical_inttest";

let pacienteId;

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(TEST_URI);

  // Datos mínimos para la búsqueda con cotización.
  const esp = await EspecialidadModel.create({
    nombre: "Cardiología (test)",
    duracionTurnoEnMins: 30,
    costoConsulta: 10000,
  });

  const plan = await PlanModel.create({
    nombre: "Plan Test",
    coberturasEspecialidad: [
      { especialidad: esp._id, porcentaje: 50, nivel: NivelCobertura.PARCIAL },
    ],
    coberturasPracticas: [],
  });

  const obra = await ObraSocialModel.create({ nombre: "OS Test", planes: [plan._id] });

  const userMed = await UsuarioModel.create({ nombreUsuario: "med.test", password: "x", usuarioTipo: "MEDICO" });
  const userPac = await UsuarioModel.create({ nombreUsuario: "pac.test", password: "x", usuarioTipo: "PACIENTE" });

  const medico = await MedicoModel.create({
    usuario: userMed._id,
    matricula: "TEST-001",
    nombre: "Dr. Test",
    especialidades: [esp._id],
    sedes: [{ nombre: "Sede Test", direccion: "Calle Falsa 123" }],
  });

  const paciente = await PacienteModel.create({
    usuario: userPac._id,
    dni: "99999999",
    nombre: "Paciente Test",
    obraSocial: obra._id,
    plan: plan._id,
  });
  pacienteId = paciente._id.toString();

  const manana = new Date();
  manana.setDate(manana.getDate() + 2);
  manana.setHours(10, 0, 0, 0);

  await TurnoModel.create({
    medico: medico._id,
    fechaHora: manana,
    sede: medico.sedes[0],
    servicio: esp._id,
    servicioTipo: "Especialidad",
    estado: EstadoTurno.DISPONIBLE,
    costo: 10000,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Integración - GET /api/health", () => {
  it("responde 200 y status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Integración - GET /api/turnos/disponibles", () => {
  it("devuelve los turnos disponibles cotizados según el plan del paciente", async () => {
    const res = await request(app)
      .get("/api/turnos/disponibles")
      .query({ pacienteId, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.paginacion.total).toBe(1);
    const turno = res.body.turnos[0];
    expect(turno.cotizacion.nivelCobertura).toBe(NivelCobertura.PARCIAL);
    // Plan cubre 50% de 10000 -> abona 5000
    expect(turno.cotizacion.costoFinal).toBe(5000);
  });

  it("valida que pacienteId es obligatorio", async () => {
    const res = await request(app).get("/api/turnos/disponibles");
    expect(res.status).toBe(400);
  });
});
