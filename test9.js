import mongoose from 'mongoose';
import { NotificacionModel } from './schemas/notificacionSchema.js';
import { UsuarioModel } from './schemas/usuarioSchema.js';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    
    // Find medico
    const notifs = await NotificacionModel.find({ destinatario: '6a4f10634c83a9fde202f610', leida: false })
        .populate('remitente', 'nombre nombreUsuario usuarioTipo')
        .populate('destinatario', 'nombre nombreUsuario usuarioTipo');
        
    console.log("Notificaciones fetched:", notifs.length);
    console.log(notifs.map(n => n.mensaje));
    mongoose.disconnect();
}

test().catch(console.error);
