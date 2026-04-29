export type TransactionType = "income" | "expense";

/**
 * Represents a transaction.
 * @interface Transaction
 */
export interface Transaction {
  readonly id: string;
  amount: number;
  type: TransactionType;
  description: string;
  categoryId: string | null;
  readonly createdAt: Date;
}

/**
 * Creates a new transaction object.
 * @param {TransactionType} type - The type of the transaction.
 * @param {number} amount - The amount of the transaction.
 * @param {string} description - The description of the transaction.
 * @returns {Transaction} - A new transaction object.
 */
export function createTransaction(type: TransactionType, amount: number, description: string, categoryId: string | null): Transaction {
  return {
    id: crypto.randomUUID(),
    amount: Math.abs(amount),
    type: type,
    description: description,
    categoryId: categoryId,
    createdAt: new Date()
  }
}

/**
 * Checks if a transaction is valid.
 * A transaction is valid if its amount is greater than 0 and its description is not empty.
 * @param {Transaction} transaction - The transaction to check.
 * @returns {boolean} - True if the transaction is valid, false otherwise.
 */
export function isTransactionValid(transaction: Transaction): boolean {
  return transaction.amount > 0 && transaction.description.trim().length > 0;
}