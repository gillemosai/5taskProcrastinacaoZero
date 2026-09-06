import { Task } from '../../types';

let dbInstance: IDBDatabase | null = null;
const DB_NAME = '5task_quantum_v78_db';
const STORE_NAME = 'tasks_store';
const VISION_STORE = 'vision_store';
const GAMIFICATION_STORE = 'gamification_store';
const ARCHIVE_STORE = 'archive_store';
const COMPLETED_STORE = 'completed_store';

export const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 20);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(VISION_STORE)) {
        db.createObjectStore(VISION_STORE);
      }
      if (!db.objectStoreNames.contains(GAMIFICATION_STORE)) {
        db.createObjectStore(GAMIFICATION_STORE, { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(ARCHIVE_STORE)) {
        db.createObjectStore(ARCHIVE_STORE);
      }
      if (!db.objectStoreNames.contains(COMPLETED_STORE)) {
        db.createObjectStore(COMPLETED_STORE);
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveTasksToDB = async (tasks: Task[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put(tasks, 'current_tasks');
};

export const loadTasksFromDB = async (): Promise<Task[]> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('current_tasks');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
};

export const saveArchivedTasksToDB = async (tasks: Task[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(ARCHIVE_STORE, 'readwrite');
  const store = tx.objectStore(ARCHIVE_STORE);
  store.put(tasks, 'current_archive');
};

export const loadArchivedTasksFromDB = async (): Promise<Task[]> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(ARCHIVE_STORE, 'readonly');
    const store = tx.objectStore(ARCHIVE_STORE);
    const request = store.get('current_archive');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
};

export const saveCompletedTasksToDB = async (tasks: Task[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(COMPLETED_STORE, 'readwrite');
  const store = tx.objectStore(COMPLETED_STORE);
  store.put(tasks, 'current_completed');
};

export const loadCompletedTasksFromDB = async (): Promise<Task[]> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(COMPLETED_STORE, 'readonly');
    const store = tx.objectStore(COMPLETED_STORE);
    const request = store.get('current_completed');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
};

export const saveGamificationPointsToDB = async (points: number): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(GAMIFICATION_STORE, 'readwrite');
  const store = tx.objectStore(GAMIFICATION_STORE);
  store.put(points, 'total_points');
};

export const loadGamificationPointsFromDB = async (): Promise<number> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(GAMIFICATION_STORE, 'readonly');
    const store = tx.objectStore(GAMIFICATION_STORE);
    const request = store.get('total_points');
    request.onsuccess = () => resolve(request.result || 0);
    request.onerror = () => resolve(0);
  });
};
