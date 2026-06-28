import React, { createContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

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
      
      CREATE TABLE IF NOT EXISTS weld_photos (
        id TEXT PRIMARY KEY,
        weldId TEXT NOT NULL,
        photoUri TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY(weldId) REFERENCES welds(id)
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
    return id;
  };

  const deleteWeld = async (id) => {
    if (!db) return;

    // Ta bort associerade bilder
    const photos = await db.getAllAsync('SELECT photoUri FROM weld_photos WHERE weldId = ?', [id]);
    for (const photo of photos) {
      try {
        await FileSystem.deleteAsync(photo.photoUri);
      } catch (e) {
        console.log('Error deleting photo:', e);
      }
    }

    await db.runAsync('DELETE FROM weld_photos WHERE weldId = ?', [id]);
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

  const addPhoto = async (weldId, photoUri) => {
    if (!db) return null;

    const photoId = Date.now().toString();
    const createdAt = new Date().toISOString();

    // Kopiera foto till app-mappen för permanent lagring
    const fileName = `weld_${weldId}_${photoId}.jpg`;
    const photoDir = `${FileSystem.documentDirectory}photos/`;
    
    try {
      await FileSystem.makeDirectoryAsync(photoDir, { intermediates: true });
      const savedPhotoUri = `${photoDir}${fileName}`;
      await FileSystem.copyAsync({
        from: photoUri,
        to: savedPhotoUri,
      });

      await db.runAsync(
        `INSERT INTO weld_photos (id, weldId, photoUri, createdAt)
         VALUES (?, ?, ?, ?)`,
        [photoId, weldId, savedPhotoUri, createdAt]
      );

      return photoId;
    } catch (error) {
      console.log('Error saving photo:', error);
      return null;
    }
  };

  const getPhotos = async (weldId) => {
    if (!db) return [];

    const photos = await db.getAllAsync(
      'SELECT * FROM weld_photos WHERE weldId = ? ORDER BY createdAt DESC',
      [weldId]
    );
    return photos;
  };

  const deletePhoto = async (photoId, weldId) => {
    if (!db) return;

    const photo = await db.getFirstAsync(
      'SELECT photoUri FROM weld_photos WHERE id = ?',
      [photoId]
    );

    if (photo) {
      try {
        await FileSystem.deleteAsync(photo.photoUri);
      } catch (e) {
        console.log('Error deleting photo file:', e);
      }
    }

    await db.runAsync('DELETE FROM weld_photos WHERE id = ?', [photoId]);
  };

  return (
    <WeldContext.Provider value={{ welds, addWeld, deleteWeld, updateWeld, addPhoto, getPhotos, deletePhoto }}>
      {children}
    </WeldContext.Provider>
  );
};
