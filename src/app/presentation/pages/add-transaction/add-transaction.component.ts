import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Transaction, TransactionType } from "../../../domain/entities/transaction";
import { TransactionRepository } from "../../../infrastructure/repositories/transaction.repository";

@Component({
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
  imports: [CommonModule, FormsModule],
})
export class AddTransactionComponent {
  type = signal<TransactionType>('expense');
  amount = 0;
  description = '';
  transactions = signal<Transaction[]>([]);

  constructor(private repo: TransactionRepository) {
    this.loadTransactions();
  }

  setType(t: TransactionType) {
    this.type.set(t);
  }

  isValid(): boolean {
    return this.amount > 0 && this.description.trim().length > 0;
  }

  save() {
    if (!this.isValid()) return;

    this.repo.add({
      type: this.type(),
      amount: this.amount,
      description: this.description
    });

    this.amount = 0;
    this.description = '';
    this.loadTransactions();
  }

  delete(id: string) {
    this.repo.delete(id);
    this.loadTransactions();
  }

  private loadTransactions() {
    this.transactions.set(this.repo.getAll());
  }
}