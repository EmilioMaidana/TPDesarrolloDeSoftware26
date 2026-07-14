import mongoose from 'mongoose';

//CONEXION A LA BASE DE DATOS
export class MongoDBClient {
    static async connect() {
        try {
            const uri = process.env.MONGODB_URI;
            const dbName = process.env.MONGODB_DB_NAME;

            const conn = await mongoose.connect(uri, {
                dbName: dbName,
                serverSelectionTimeoutMS: 3000
            });

            console.log(`MongoDB is connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}