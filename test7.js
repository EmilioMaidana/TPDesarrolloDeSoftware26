import mongoose from 'mongoose';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    const db = mongoose.connection.db;
    const medico = await db.collection('medicos').findOne({ usuario: new mongoose.Types.ObjectId('6a4f10634c83a9fde202f610') });
    console.log("Medico:", medico ? medico.nombre : "Not found");
    const m2 = await db.collection('medicos').findOne({ usuario: new mongoose.Types.ObjectId('6a4f10634c83a9fde202f612') });
    console.log("Medico2:", m2 ? m2.nombre : "Not found");
    mongoose.disconnect();
}

test().catch(console.error);
