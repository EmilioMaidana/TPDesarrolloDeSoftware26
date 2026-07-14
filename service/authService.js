import jwt from 'jsonwebtoken';
import { UnauthorizedError } from "../errors/AppErrors.js";
import { TipoUsuario } from "../domain/Enums.js";


export class AuthService {

    constructor(usuarioRepository, pacienteRepository, medicoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
    }

    /**
     * Login con JWT: valida usuario y contraseña contra la
     * colección de usuarios y devuelve el perfil y el token JWT.
     */
    async login(nombreUsuario, password) {
        const usuario = await this.usuarioRepository.findByNombreUsuario(nombreUsuario);
        if (!usuario || usuario.password !== password) {
            throw new UnauthorizedError('Usuario o contraseña incorrectos');
        }

        let perfil;

        if (usuario.usuarioTipo === TipoUsuario.MEDICO) {
            const medico = await this.medicoRepository.findByUsuario(usuario._id);
            if (!medico) {
                throw new UnauthorizedError('El usuario no tiene un perfil de médico asociado');
            }
            perfil = {
                tipo: TipoUsuario.MEDICO,
                id: medico._id,
                usuarioId: usuario._id,
                nombre: medico.nombre,
                nombreUsuario: usuario.nombreUsuario,
            };
        } else {
            const paciente = await this.pacienteRepository.findByUsuario(usuario._id);
            if (!paciente) {
                throw new UnauthorizedError('El usuario no tiene un perfil de paciente asociado');
            }
            perfil = {
                tipo: TipoUsuario.PACIENTE,
                id: paciente._id,
                usuarioId: usuario._id,
                nombre: paciente.nombre,
                nombreUsuario: usuario.nombreUsuario,
            };
        }

        // Generar JWT
        const token = jwt.sign(
            { id: perfil.id, usuarioId: perfil.usuarioId, tipo: perfil.tipo },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { ...perfil, token };
    }
}
