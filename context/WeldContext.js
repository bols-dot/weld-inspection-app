import React, { createContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export const WeldContext = createContext();

export const WeldProvider = ({ children }) => {
  const [welds, setWelds] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    const database = await SQLite.openDatabaseAsync('welds.db');
    setDb(database);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS welds (
        id TEXT PRIMARY KEY,
        weldId TEXT NOT NULL,
        testDate TEXT NOT NULL,
        nextValidationDate TEXT NOT NULL,
        testResult TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    loadWelds(database);
  };

  const loadWelds = async (database) => {
    const result = await database.getAllAsync('SELECT * FROM welds ORDER BY testDate DESC');
    setWelds(result);
  };

  const addWeld = async (weldData) => {
    if (!db) return;

    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO welds (id, weldId, testDate, nextValidationDate, testResult, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, weldData.weldId, weldData.testDate, weldData.nextValidationDate, weldData.testResult, weldData.notes, createdAt]
    );

    loadWelds(db);
  };

  const deleteWeld = async (id) => {
    if (!db) return;

    await db.runAsync('DELETE FROM welds WHERE id = ?', [id]);
    loadWelds(db);
  };

  const updateWeld = async (id, weldData) => {
    if (!db) return;

    await db.runAsync(
      `UPDATE welds SET weldId = ?, testDate = ?, nextValidationDate = ?, testResult = ?, notes = ? WHERE id = ?`,
      [weldData.weldId, weldData.testDate, weldData.nextValidationDate, weldData.testResult, weldData.notes, id]
    );

    loadWelds(db);
  };

  return (
    <WeldContext.Provider value={{ welds, addWeld, deleteWeld, updateWeld }}>
      {children}
    </WeldContext.Provider>
  );
};