import mongoose from 'mongoose';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    const db = mongoose.connection.db;
    const usr = await db.collection('usuarios').findOne({ _id: new mongoose.Types.ObjectId('6a4f10634c83a9fde202f614') });
    console.log("Usuario:", usr);
    mongoose.disconnect();
}

test().catch(console.error);
