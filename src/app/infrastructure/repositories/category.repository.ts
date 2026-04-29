import { Injectable } from "@angular/core";
import { Category, createCategory } from "../../domain/entities/category";

@Injectable({providedIn: "root"})
export class CategoryRepository {

    private readonly STORAGE_KEY = "categories";
    private db: IDBDatabase | null = null;

    // Инициализация категорий по умолачнию при первом запуске
    async initCategories(): Promise<void> {
        const existing = await this.getAll();
        
        const defaultCategories: Category[] = [
            createCategory('Еда', '🍔', '#4CAF50', true),
            createCategory('Транспорт', '🚗', '#2196F3', true),
            createCategory('Дом', '🏠', '#FF9800', true),
            createCategory('Здоровье', '💊', '#F44336', true),
            createCategory('Развлечения', '🎬', '#9C27B0', true),
            createCategory('Другое', '📌', '#9E9E9E', true),
            createCategory('Доход', '💰', '#4CAF50', true),
        ];

    for (const category of defaultCategories) {
        if (!existing.some((existingCategory) => existingCategory.name === category.name)) {
            await this.add(category);
        }
    }
  }

    async add(category: Category): Promise<void> {
        const db = await this.openDb();

        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.STORAGE_KEY], "readwrite");
            const store = tx.objectStore(this.STORAGE_KEY);
            const request = store.add(category);

            request.onsuccess = () => {
                resolve();
            }

            request.onerror = () => {
                reject(request.error);  
            }
        });
    }

    async getAll(): Promise<Category[]> {
        const db = await this.openDb();

        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.STORAGE_KEY], "readonly");
            const store = tx.objectStore(this.STORAGE_KEY);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            }            

            request.onerror = () => {
                reject(request.error);
            }
        }); 
    }

    async openDb(): Promise<IDBDatabase> {
        if (this.db) {
            return Promise.resolve(this.db);
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open("FinFlowDB", 2);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                // Создаём хранилище для транзакций, если его нет
                if (!db.objectStoreNames.contains("transactions")) {
                    const txStore = db.createObjectStore("transactions", { keyPath: "id" });
                    txStore.createIndex("createdAt", "createdAt", { unique: false });
                }
                
                // Создаём хранилище для категорий, если его нет
                if (!db.objectStoreNames.contains(this.STORAGE_KEY)) {
                    const catStore = db.createObjectStore(this.STORAGE_KEY, { keyPath: "id" });
                    catStore.createIndex("createdAt", "createdAt", { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            }
        })
    }
}