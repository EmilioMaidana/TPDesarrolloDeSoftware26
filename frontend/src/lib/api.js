import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// No forzamos Content-Type globalmente: axios ya lo agrega cuando hay body JSON.
// Así los GET quedan como "simple requests" y evitamos preflights CORS innecesarios.
export const api = axios.create({ baseURL });

// Extrae un mensaje de error legible de cualquier respuesta del backend.
export function mensajeDeError(error, fallback = "Ocurrió un error inesperado") {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
}

// ---------- Catálogo / lectura ----------

export async function getMedicos() {
  const { data } = await api.get("/medicos");
  return data;
}

export async function getMedico(id) {
  const { data } = await api.get(`/medicos/${id}`);
  return data;
}

export async function getPacientes() {
  const { data } = await api.get("/pacientes");
  return data;
}

export async function getPaciente(id) {
  const { data } = await api.get(`/pacientes/${id}`);
  return data;
}

export async function getEspecialidades() {
  const { data } = await api.get("/servicios/especialidades");
  return data;
}

export async function getPracticas() {
  const { data } = await api.get("/servicios/practicas");
  return data;
}

export async function getSedes() {
  const { data } = await api.get("/sedes");
  return data;
}

// ---------- Búsqueda de turnos ----------

// filtros: { medicoId, especialidadId, practicaId, sede, fechaInicio, fechaFin,
//            page, limit, sortBy, order }
export async function buscarTurnos(pacienteId, filtros = {}) {
  const params = { pacienteId, ...limpiar(filtros) };
  const { data } = await api.get("/turnos/disponibles", { params });
  return data;
}

// ---------- Ciclo de vida de turnos ----------

export async function reservarTurno(turnoId, pacienteId) {
  const { data } = await api.post(`/turnos/${turnoId}/reservar`, null, {
    params: { pacienteId },
  });
  return data;
}

export async function cancelarTurno(turnoId, usuarioId, motivo, esMedico = false) {
  const { data } = await api.post(
    `/turnos/${turnoId}/cancelar`,
    { motivo },
    { params: { usuarioId, esMedico } }
  );
  return data;
}

export async function aceptarTurno(turnoId, medicoId) {
  const { data } = await api.post(`/turnos/${turnoId}/aceptar`, null, {
    params: { medicoId },
  });
  return data;
}

export async function marcarRealizado(turnoId, medicoId) {
  const { data } = await api.patch(`/turnos/${turnoId}/realizado`, null, {
    params: { medicoId },
  });
  return data;
}

export async function proponerReprogramacion(turnoId, usuarioId, nuevaFecha) {
  const { data } = await api.patch(
    `/turnos/${turnoId}/reprogramar`,
    { nuevaFecha },
    { params: { usuarioId } }
  );
  return data;
}

export async function confirmarReprogramacion(turnoId, usuarioId) {
  const { data } = await api.patch(
    `/turnos/${turnoId}/confirmar-reprogramacion`,
    null,
    { params: { usuarioId } }
  );
  return data;
}

export async function getAgendaMedico(medicoId, estado) {
  const params = estado ? { estado } : {};
  const { data } = await api.get(`/turnos/medico/${medicoId}`, { params });
  return data;
}

export async function getHistorialPaciente(pacienteId) {
  const { data } = await api.get(`/turnos/historial/paciente/${pacienteId}`);
  return data;
}

export async function getHistorialPacienteParaMedico(medicoId, pacienteId) {
  const { data } = await api.get(
    `/turnos/historial/medico/${medicoId}/paciente/${pacienteId}`
  );
  return data;
}

// ---------- Disponibilidad y servicios del médico ----------

export async function getDisponibilidad(medicoId) {
  const { data } = await api.get(`/medicos/${medicoId}/disponibilidad`);
  return data;
}

export async function crearDisponibilidad(medicoId, disponibilidad) {
  const { data } = await api.post(
    `/medicos/${medicoId}/disponibilidad`,
    disponibilidad
  );
  return data;
}

export async function getServiciosDeMedico(medicoId) {
  const { data } = await api.get(`/medicos/${medicoId}/servicios`);
  return data;
}

export async function altaServicio(medicoId, tipo, servicioId) {
  const { data } = await api.post(`/medicos/${medicoId}/servicios`, {
    tipo,
    servicioId,
  });
  return data;
}

export async function bajaServicio(medicoId, tipo, servicioId) {
  const { data } = await api.delete(
    `/medicos/${medicoId}/servicios/${servicioId}`,
    { params: { tipo } }
  );
  return data;
}

// ---------- Notificaciones ----------

export async function getNotificacionesNoLeidas(usuarioId) {
  const { data } = await api.get(`/notificaciones/no-leidas/${usuarioId}`);
  return data;
}

export async function getNotificacionesLeidas(usuarioId) {
  const { data } = await api.get(`/notificaciones/leidas/${usuarioId}`);
  return data;
}

export async function marcarNotificacionLeida(notificacionId) {
  const { data } = await api.patch(`/notificaciones/${notificacionId}/leer`);
  return data;
}

// Quita claves vacías para no ensuciar la query string.
function limpiar(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}
