import fs from 'fs';
import path from 'path';
import { AppState } from './types';

const DB_PATH = path.join(process.cwd(), 'data/db.json');

// Initialize database with default data if it doesn't exist
const initializeDB = () => {
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData: AppState = {
      products: [],
      transactions: [],
      staff: [
        {
          id: '1',
          name: 'Admin',
          role: 'admin',
          pin: '1234', // In production, use proper encryption
        },
      ],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
};

export const getDB = (): AppState => {
  initializeDB();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

export const writeDB = (data: AppState) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export const updateDB = (updater: (db: AppState) => AppState) => {
  const db = getDB();
  const newDB = updater(db);
  writeDB(newDB);
  return newDB;
};