import mongoose from 'mongoose';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    const db = mongoose.connection.db;
    const notifs = await db.collection('notificaciones').find({ mensaje: { $regex: 'paciente ha cancelado' } }).toArray();
    console.log('Notificaciones de cancelacion de paciente:', notifs.length);
    console.log(notifs.map(n => n.mensaje));
    mongoose.disconnect();
}

test().catch(console.error);
