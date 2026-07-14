import mongoose from 'mongoose';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    const db = mongoose.connection.db;
    const notifs = await db.collection('notificaciones').find({ mensaje: { $regex: 'lele pancha' } }).toArray();
    console.log(notifs[0]);
    mongoose.disconnect();
}

test().catch(console.error);
