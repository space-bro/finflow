type TransactionType = "income" | "expense";

/**
 * Represents a transaction.
 * @interface Transaction
 */
interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  createdAt: Date;
}

/**
 * Creates a new transaction object.
 * @param {number} amount - The amount of the transaction.
 * @param {TransactionType} type - The type of the transaction.
 * @param {string} description - The description of the transaction.
 * @returns {Transaction} - A new transaction object.
 */
function createTransaction(amount: number, type: TransactionType, description: string): Transaction {
  return {
    id: crypto.randomUUID(),
    amount: amount,
    type: type,
    description: description,
    createdAt: new Date()
  }
}
