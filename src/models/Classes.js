export const EstadoTurno = Object.freeze({
    DISPONIBLE: "DISPONIBLE",
    RESERVADO: "RESERVADO",
    CONFIRMADO: "CONFIRMADO",
    CANCELADO: "CANCELADO",
    REALIZADO: "REALIZADO"
});

export const NivelCobertura = Object.freeze({
    TOTAL: "TOTAL",
    PACIAL: "PARCIAL",
    NO_CUBIERTA : "NO_CUBIERTA"
});

export const DiaSemana = Object.freeze({
    LUNES: "LUNES",
    MARTES: "MARTES",
    MIERCOLES: "MIERCOLES",
    JUEVES:"JUEVES",
    VIERNES:"VIERNES",
    SABADO:"SABADO",
    DOMINGO:"DOMINGO"
});


class SweetMedical{
    reservarUnTurno(unTurno){
        
    }
}


class CambioDeEstadoTurno{
    constructor (fechaHoraDeIngreso,estado,turno,usuario,motivo){
        this.fechaHoraDeIngreso = fechaHoraDeIngreso;
        this.estado = estado;
        this.turno = turno;
        this.usuario = usuario;
        this.motivo = motivo;
    }
}

class Turno{
    constructor(id,medico,paciente,fechaHora,sede,practica,estado,historialEstados,costo){
        this.id = id;
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = estado;
        this.historialEstados = historialEstados
        this.costo = costo
    }

     actualizarEstado(estadoTurno,usuario,motivo){
        if(usuario.verificarCobertura()){
            medico.agendarTurno(this.fechaHora,this.practica);
        }
    }
}
export class Agenda {
    // Metodo 1: Especifico para especialidades
    generarTurnosPorEspecialidad(especialidad, medico) {
        console.log(`Generando turnos de ${especialidad} para el Dr. ${medico.nombre}...`);
        // Aqui iria tu logica de creacion (fechas, horarios, etc.)
    }

    // Metodo 2: Especifico para practicas
    generarTurnosPorPractica(practica, medico) {
        console.log(`Generando turnos para la practica '${practica}' con el Dr. ${medico.nombre}...`);
        // Aqui iria tu logica de creacion
    }
    // Metodo 3: Refrescar disponibilidad
    refrescarTurnosSegunDisponibilidadDe(medico) {
        console.log(`Actualizando la agenda segun la disponibilidad del Dr. ${medico.nombre}...`);
        // Logica para revisar los horarios del medico y habilitar/deshabilitar turnos
    }
}
class Medico{
    constructor(id,usuario,matricula,nombre,especialidades = [],practicas = [],sedes = [],disponibilidades = []){    
        this.id = id;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.disponibilidades = disponibilidades;
    }
    definirDisponibilidad(disponibilidad){
        this.disponibilidades.push(disponibilidad);
    }

    agregarEspecialidad(especialidad) {
        this.especialidades.push(especialidad);
    }

    agregarPractica(practica) {
        this.practicas.push(practica);
    }

    agregarSede(sede) {
        this.sedes.push(sede);
    }

    reducirDisponibilidad(unaDisponibilidad){
        this.disponibilidades.reduce(unaDisponibilidad);
    }

    agendarTurno(fechaHora, practica){
        this.reducirDisponibilidad(fechaHora);
        this.agregarPractica(practica);
    }
}

class Paciente{
    constructor(id,usuario,dni,obraSocial,plan){
        this.id = id;
        this.usuario = usuario;
        this.dni = dni;
        this.obraSocial = obraSocial;
        this.plan = plan;
    }
}

class FactoryNotification{ 
    crearSegunEstadoTurno(turno){}
}

class Notificacion{
    constructor(id, remitente, destinatario,mensaje, fechaHoraCreacion, fechaHoraLeida,leida){
        this.id = id;
        this.remitente = remitente;
        this.destinatario = destinatario;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = fechaHoraCreacion;
        this.fechaHoraLeida = fechaHoraLeida;
        this.leida = leida;
    }

    marcarComoLeida(){
        this.leida = true ;
    }
}

class ObraSocial{
    constructor(id,nombre,planes){
        this.id = id;
        this.nombre = nombre;
        this.planes = planes;
    }
}

class Sede{
    constructor(id,nombre,direccion){
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
    }
}

class DisponibilidadHoraria{
    constructor(diaSemana,horaDesde,horaHasta){
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
    }
}

class Usuario{
    constructor(id,nombreUsuario,password){
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.password = password;
    }

    verificarCobertura(){
        
    }
}

class Plan{
    constructor(id, nombre, coberturasEspecialidad, coberturasPractica){
        this.id = id;
        this.nombre = nombre;
        this.coberturasEspecialidad = coberturasEspecialidad;
        this.coberturasPractica = coberturasPractica;
    }
    obtenerCoberturaPorEspecialidad(especialidad){
        this.coberturasEspecialidad.push(especialidad);
    }
    obtenerCoberturaPorPractica(practica){
        this.coberturasPractica.push(practica)
    }
}

export class CoberturaEspecialidad {
    constructor(especialidad, nivel) {
        this.especialidad = especialidad;
        this.nivel = nivel;
    }
}


export class CoberturaPractica {
    constructor(practica, nivelCobertura) {
        this.practica = practica;
        this.nivelCobertura = nivelCobertura;
    }
}


export class Especialidad {
    constructor(id, nombre, duracionTurno, costoConsulta) {
        this.id = id;
        this.nombre = nombre;
        this.duracionTurnoEnMin = duracionTurno;
        this.costoConsulta = costoConsulta;
    }
}


export class Practica {
    constructor(id, codigo, nombre, duracionTurnoEnMins, costo) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }
}