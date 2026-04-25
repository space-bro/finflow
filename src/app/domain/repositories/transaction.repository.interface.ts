import { Transaction } from "../entities/transaction";

export interface ITransactionRepository {
  getAll(): Promise<Transaction[]>;
  add(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}