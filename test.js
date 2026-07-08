
import request from 'supertest';
import app from './app.js';
import { MongoDBClient } from './config/database.js';

async function run() {
  try {
    await MongoDBClient.connect();
    const res = await request(app).get('/api/notificaciones/66735e165b4c102c91c33744?leidas=true');
    console.log('Status:', res.statusCode);
    console.log('Body:', JSON.stringify(res.body));
  } catch(e) {
    console.error('ERROR:', e);
  } finally {
    process.exit(0);
  }
}
run();

