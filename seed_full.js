import mongoose from 'mongoose';
import { EspecialidadModel } from './schemas/especialidadSchema.js';
import { PracticaModel } from './schemas/practicaSchema.js';
import { ObraSocialModel } from './schemas/obraSocialSchema.js';
import { PlanModel } from './schemas/planSchema.js';
import { UsuarioModel } from './schemas/usuarioSchema.js';
import { MedicoModel } from './schemas/medicoSchema.js';
import { PacienteModel } from './schemas/pacienteSchema.js';
import { TurnoModel } from './schemas/turnoSchema.js';
import { NotificacionModel } from './schemas/notificacionSchema.js';
import { EstadoTurno, NivelCobertura, DiaSemana } from './domain/Enums.js';

async function runSeed() {
    console.log("Conectando a mongodb://127.0.0.1:27018/SweetMedical...");
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical', { authSource: 'admin' });
    console.log("✅ Conectado!");

    console.log("Limpiando colecciones...");
    await Promise.all([
        EspecialidadModel.deleteMany({}),
        PracticaModel.deleteMany({}),
        PlanModel.deleteMany({}),
        ObraSocialModel.deleteMany({}),
        UsuarioModel.deleteMany({}),
        MedicoModel.deleteMany({}),
        PacienteModel.deleteMany({}),
        TurnoModel.deleteMany({}),
        NotificacionModel.deleteMany({})
    ]);

    console.log("Insertando Especialidades...");
    const espCardio = await EspecialidadModel.create({ nombre: "Cardiología", duracionTurnoEnMins: 30, costoConsulta: 30000 });
    const espDermat = await EspecialidadModel.create({ nombre: "Dermatología", duracionTurnoEnMins: 20, costoConsulta: 25000 });
    const espPediat = await EspecialidadModel.create({ nombre: "Pediatría", duracionTurnoEnMins: 30, costoConsulta: 20000 });

    console.log("Insertando Prácticas...");
    const pracElectro = await PracticaModel.create({ codigo: "P001", nombre: "Electrocardiograma", duracionTurnoEnMins: 15, costoConsulta: 10000 });
    const pracEco = await PracticaModel.create({ codigo: "P002", nombre: "Ecocardiograma", duracionTurnoEnMins: 45, costoConsulta: 40000 });
    const pracPiel = await PracticaModel.create({ codigo: "P003", nombre: "Biopsia de piel", duracionTurnoEnMins: 40, costoConsulta: 35000 });

    console.log("Insertando Planes...");
    const planOsde210 = await PlanModel.create({
        nombre: "Plan 210",
        coberturasEspecialidad: [
            { especialidad: espCardio._id, porcentaje: 80, nivel: NivelCobertura.PARCIAL },
            { especialidad: espPediat._id, porcentaje: 100, nivel: NivelCobertura.TOTAL }
        ],
        coberturasPracticas: [
            { practica: pracElectro._id, porcentaje: 100, nivel: NivelCobertura.TOTAL }
        ]
    });

    const planOsde410 = await PlanModel.create({
        nombre: "Plan 410 Premium",
        coberturasEspecialidad: [
            { especialidad: espCardio._id, porcentaje: 100, nivel: NivelCobertura.TOTAL },
            { especialidad: espDermat._id, porcentaje: 100, nivel: NivelCobertura.TOTAL },
            { especialidad: espPediat._id, porcentaje: 100, nivel: NivelCobertura.TOTAL }
        ],
        coberturasPracticas: [
            { practica: pracElectro._id, porcentaje: 100, nivel: NivelCobertura.TOTAL },
            { practica: pracEco._id, porcentaje: 100, nivel: NivelCobertura.TOTAL },
            { practica: pracPiel._id, porcentaje: 80, nivel: NivelCobertura.PARCIAL }
        ]
    });

    console.log("Insertando Obras Sociales...");
    const osde = await ObraSocialModel.create({
        nombre: "OSDE",
        planes: [planOsde210._id, planOsde410._id]
    });

    console.log("Insertando Usuarios...");
    const userMedico1 = await UsuarioModel.create({ nombreUsuario: "dr.gomez", password: "123", usuarioTipo: "MEDICO" });
    const userMedico2 = await UsuarioModel.create({ nombreUsuario: "dra.perez", password: "123", usuarioTipo: "MEDICO" });
    const userPac1 = await UsuarioModel.create({ nombreUsuario: "paciente.juan", password: "123", usuarioTipo: "PACIENTE" });
    const userPac2 = await UsuarioModel.create({ nombreUsuario: "paciente.maria", password: "123", usuarioTipo: "PACIENTE" });

    console.log("Insertando Médicos...");
    const medico1 = await MedicoModel.create({
        usuario: userMedico1._id,
        matricula: "MN-12345",
        nombre: "Dr. Carlos Gómez",
        especialidades: [espCardio._id],
        practicas: [pracElectro._id, pracEco._id],
        sedes: [{ nombre: "Sede Central", direccion: "Av. Corrientes 1234" }],
        disponibilidades: [
            { diaSemana: DiaSemana.LUNES, horaDesde: "09:00", horaHasta: "13:00", servicio: espCardio._id, servicioTipo: "Especialidad", sede: { nombre: "Sede Central", direccion: "Av. Corrientes 1234" } },
            { diaSemana: DiaSemana.MIERCOLES, horaDesde: "14:00", horaHasta: "18:00", servicio: pracElectro._id, servicioTipo: "Practica", sede: { nombre: "Sede Central", direccion: "Av. Corrientes 1234" } }
        ]
    });

    const medico2 = await MedicoModel.create({
        usuario: userMedico2._id,
        matricula: "MN-67890",
        nombre: "Dra. Ana Pérez",
        especialidades: [espDermat._id, espPediat._id],
        practicas: [pracPiel._id],
        sedes: [{ nombre: "Sede Norte", direccion: "Av. Cabildo 4567" }],
        disponibilidades: [
            { diaSemana: DiaSemana.MARTES, horaDesde: "10:00", horaHasta: "14:00", servicio: espDermat._id, servicioTipo: "Especialidad", sede: { nombre: "Sede Norte", direccion: "Av. Cabildo 4567" } },
            { diaSemana: DiaSemana.JUEVES, horaDesde: "09:00", horaHasta: "12:00", servicio: espPediat._id, servicioTipo: "Especialidad", sede: { nombre: "Sede Norte", direccion: "Av. Cabildo 4567" } }
        ]
    });

    console.log("Insertando Pacientes...");
    const paciente1 = await PacienteModel.create({
        usuario: userPac1._id,
        dni: "30123456",
        nombre: "Juan Domínguez",
        obraSocial: osde._id,
        plan: planOsde210._id
    });

    const paciente2 = await PacienteModel.create({
        usuario: userPac2._id,
        dni: "28765432",
        nombre: "María López",
        obraSocial: osde._id,
        plan: planOsde410._id
    });

    console.log("Insertando Turnos (Semana próxima)...");
    const proximoLunes = new Date();
    proximoLunes.setDate(proximoLunes.getDate() + (1 + 7 - proximoLunes.getDay()) % 7);
    if (proximoLunes.getDay() === 0) proximoLunes.setDate(proximoLunes.getDate() + 1); // Forzar que sea la próxima semana
    proximoLunes.setHours(9, 0, 0, 0);

    const proximoMartes = new Date(proximoLunes);
    proximoMartes.setDate(proximoMartes.getDate() + 1);
    proximoMartes.setHours(10, 0, 0, 0);

    const proximoMiercoles = new Date(proximoLunes);
    proximoMiercoles.setDate(proximoLunes.getDate() + 2);
    proximoMiercoles.setHours(14, 0, 0, 0);

    // Turno DISPONIBLE
    await TurnoModel.create({
        medico: medico1._id,
        fechaHora: proximoLunes,
        sede: medico1.sedes[0],
        servicio: espCardio._id,
        servicioTipo: "Especialidad",
        estado: EstadoTurno.DISPONIBLE,
        costo: espCardio.costoConsulta
    });

    // Turno RESERVADO por paciente 1
    const turnoReservado = await TurnoModel.create({
        medico: medico2._id,
        paciente: paciente1._id,
        fechaHora: proximoMartes,
        sede: medico2.sedes[0],
        servicio: espDermat._id,
        servicioTipo: "Especialidad",
        estado: EstadoTurno.RESERVADO,
        costo: espDermat.costoConsulta,
        costoConCobertura: espDermat.costoConsulta // Plan 210 no cubre Dermatología
    });

    // Turno CONFIRMADO por paciente 2
    await TurnoModel.create({
        medico: medico1._id,
        paciente: paciente2._id,
        fechaHora: proximoMiercoles,
        sede: medico1.sedes[0],
        servicio: pracElectro._id,
        servicioTipo: "Practica",
        estado: EstadoTurno.CONFIRMADO,
        costo: pracElectro.costoConsulta,
        costoConCobertura: 0 // Plan 410 lo cubre 100%
    });

    console.log("Insertando Notificaciones...");
    await NotificacionModel.create({
        destinatario: userMedico2._id,
        remitente: userPac1._id,
        mensaje: `El paciente Juan Domínguez ha reservado un turno para ${proximoMartes.toLocaleString('es-AR')}`
    });

    await NotificacionModel.create({
        destinatario: userPac1._id,
        remitente: userMedico2._id,
        mensaje: `Tu turno del ${proximoMartes.toLocaleString('es-AR')} ha sido agendado exitosamente.`
    });

    console.log("==========================================");
    console.log("✅ SEED FINALIZADO CON ÉXITO EN db_data2 !");
    console.log("Puedes probar la API modificando tu .env:");
    console.log("MONGODB_URI=mongodb://127.0.0.1:27018");
    console.log("MONGODB_DB_NAME=SweetMedical");
    console.log("==========================================");

    process.exit(0);
}

runSeed().catch(err => {
    console.error("Error corriendo seed:", err);
    process.exit(1);
});
