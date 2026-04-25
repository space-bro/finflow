import { Injectable } from "@angular/core";
import { createTransaction, Transaction } from "../../domain/entities/transaction";

@Injectable({providedIn: "root"})
export class TransactionIndexedDBRepository {

    private db: IDBDatabase | null = null;

    private openDB(): Promise<IDBDatabase> {
        if (this.db) {
            return Promise.resolve(this.db);
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open("FinFlowDB", 1);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains("transactions")) {
                    const store = db.createObjectStore("transactions", { keyPath: "id" });
                    store.createIndex("createdAt", "createdAt", {unique: false});
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            }
        });
    }

    async getAll(): Promise<Transaction[]> {
        const db = await this.openDB();
        const transactions: Transaction[] = [];

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["transactions"], "readonly");
            const store = transaction.objectStore("transactions");
            const index = store.index("createdAt");
            const request = index.openCursor(null, "prev");

            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    transactions.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(transactions);  
                }
            }

            request.onerror = () => {
                reject(request.error);
            }
        });
    }

    async add(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
        const db = await this.openDB();
        const newTransaction = createTransaction(transaction.type, transaction.amount, transaction.description);

        return new Promise((resolve, reject) => {
            const tx = db.transaction(["transactions"], "readwrite");
            const store = tx.objectStore("transactions");
            const request = store.add(newTransaction);

            request.onsuccess = () => {
                resolve(newTransaction);
            }

            request.onerror = () => {
                reject(request.error);
            }
        });
    }

    async delete(id: string): Promise<void> {
        const db = await this.openDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(["transactions"], "readwrite");
            const store = tx.objectStore("transactions");
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            }

            request.onerror = () => {
                reject(request.error);
            }
        });
    }

    async clear(): Promise<void> {
        const db = await this.openDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(["transactions"], "readwrite");
            const store = tx.objectStore("transactions");
            const request = store.clear();

            request.onsuccess = () => {
                resolve();
            }

            request.onerror = () => {
                reject(request.error);              
            }
        });
    }
}