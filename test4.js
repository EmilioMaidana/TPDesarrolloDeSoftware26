import mongoose from 'mongoose';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    const db = mongoose.connection.db;
    const notifs = await db.collection('notificaciones').find({ mensaje: { $regex: 'Un paciente ha cancelado' } }).toArray();
    console.log('Notificaciones de cancelacion de paciente:', notifs.length);
    if(notifs.length > 0) console.log(notifs[notifs.length-1]);
    mongoose.disconnect();
}

test().catch(console.error);
