import { Injectable } from "@angular/core";
import { createTransaction, Transaction } from "../../domain/entities/transaction";

@Injectable({providedIn: "root"})
export class TransactionRepository {

    private getTransactionsFromStorage(): Transaction[] {
        const transactions = localStorage.getItem("transactions");
        if (transactions === null) {
            return [];
        }
        const parsedTransactions = JSON.parse(transactions);
        return parsedTransactions.map((t: Transaction) => ({
            ...t,
            createdAt: new Date(t.createdAt)
        }));
    }

    private saveTransactionsToStorage(transactions: Transaction[]): void {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    getAll(): Transaction[] {
        return this.getTransactionsFromStorage().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    add(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
        const newTransaction = createTransaction(transaction.type, transaction.amount, transaction.description);
        const transactions = this.getTransactionsFromStorage();
        transactions.push(newTransaction);
        this.saveTransactionsToStorage(transactions);
        return newTransaction;
    }

    delete(id: string): void {
        const transactions = this.getTransactionsFromStorage().filter(t => t.id !== id);
        this.saveTransactionsToStorage(transactions);
    }

    clear(): void {
        this.saveTransactionsToStorage([]);
    }
}