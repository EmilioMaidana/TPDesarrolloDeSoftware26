/**
 * Registro central de modelos de Mongoose.
 *
 * Importar este modulo (por su efecto colateral) garantiza que TODOS los
 * modelos queden registrados en la conexion antes de ejecutar consultas con
 * .populate(). Sin esto, populates como paciente -> plan / obraSocial fallan
 * con "Schema hasn't been registered for model X", porque el archivo del
 * schema referenciado nunca llega a importarse.
 */
import "./usuarioSchema.js";
import "./especialidadSchema.js";
import "./practicaSchema.js";
import "./sedeSchema.js";
import "./obraSocialSchema.js";
import "./coberturaEspecialidadSchema.js";
import "./coberturaPracticaSchema.js";
import "./planSchema.js";
import "./disponibilidadHorariaSchema.js";
import "./cambioEstadoTurnoSchema.js";
import "./medicoSchema.js";
import "./pacienteSchema.js";
import "./turnoSchema.js";
import "./notificacionSchema.js";
