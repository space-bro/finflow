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
  readonly createdAt: Date;
}

/**
 * Creates a new transaction object.
 * @param {number} amount - The amount of the transaction.
 * @param {TransactionType} type - The type of the transaction.
 * @param {string} description - The description of the transaction.
 * @returns {Transaction} - A new transaction object.
 */
export function createTransaction(amount: number, type: TransactionType, description: string): Transaction {
  return {
    id: crypto.randomUUID(),
    amount: amount,
    type: type,
    description: description,
    createdAt: new Date()
  }
}

/**
 * Checks if a transaction is valid.
 * A transaction is valid if its amount is greater than 0 and its description is not empty.
 * @param {Transaction} transaction - The transaction to check.
 * @returns {boolean} - True if the transaction is valid, false otherwise.
 */
export function isTransactionVaild(transaction: Transaction): boolean {
  return transaction.amount > 0 && transaction.description.trim().length > 0;
}