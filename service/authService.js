import { UnauthorizedError } from "../errors/AppErrors.js";
import { TipoUsuario } from "../domain/Enums.js";

export class AuthService {

    constructor(usuarioRepository, pacienteRepository, medicoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
    }

    /**
     * Login sencillo (sin tokens): valida usuario y contraseña contra la
     * colección de usuarios y devuelve el perfil con el que operar en el front.
     */
    async login(nombreUsuario, password) {
        const usuario = await this.usuarioRepository.findByNombreUsuario(nombreUsuario);
        if (!usuario || usuario.password !== password) {
            throw new UnauthorizedError('Usuario o contraseña incorrectos');
        }

        if (usuario.usuarioTipo === TipoUsuario.MEDICO) {
            const medico = await this.medicoRepository.findByUsuario(usuario._id);
            if (!medico) {
                throw new UnauthorizedError('El usuario no tiene un perfil de médico asociado');
            }
            return {
                tipo: TipoUsuario.MEDICO,
                id: medico._id,
                usuarioId: usuario._id,
                nombre: medico.nombre,
                nombreUsuario: usuario.nombreUsuario,
            };
        }

        const paciente = await this.pacienteRepository.findByUsuario(usuario._id);
        if (!paciente) {
            throw new UnauthorizedError('El usuario no tiene un perfil de paciente asociado');
        }
        return {
            tipo: TipoUsuario.PACIENTE,
            id: paciente._id,
            usuarioId: usuario._id,
            nombre: paciente.nombre,
            nombreUsuario: usuario.nombreUsuario,
        };
    }
}
