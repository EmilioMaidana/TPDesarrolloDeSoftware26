export const EstadoTurno = Object.freeze({
    DISPONIBLE: "DISPONIBLE",
    RESERVADO: "RESERVADO",
    CONFIRMADO: "CONFIRMADO",
    CANCELADO: "CANCELADO",
    REALIZADO: "REALIZADO",
    PENDIENTE_CONFIRMACION: "PENDIENTE_CONFIRMACION"
});

export const NivelCobertura = Object.freeze({
    TOTAL: "TOTAL",
    PARCIAL: "PARCIAL",
    NO_CUBIERTA: "NO_CUBIERTA"
});

export const DiaSemana = Object.freeze({
    LUNES: "LUNES",
    MARTES: "MARTES",
    MIERCOLES: "MIERCOLES",
    JUEVES: "JUEVES",
    VIERNES: "VIERNES",
    SABADO: "SABADO",
    DOMINGO: "DOMINGO"
});

// Mapeo de DiaSemana a número de día JS (0=Domingo, 1=Lunes...)
export const DiaSemanaNumero = Object.freeze({
    DOMINGO: 0,
    LUNES: 1,
    MARTES: 2,
    MIERCOLES: 3,
    JUEVES: 4,
    VIERNES: 5,
    SABADO: 6
});