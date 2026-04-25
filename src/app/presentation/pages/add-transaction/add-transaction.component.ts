import { CommonModule } from "@angular/common";
import { Component, Inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Transaction, TransactionType } from "../../../domain/entities/transaction";
import { ITransactionRepository } from "../../../domain/repositories/transaction.repository.interface";
import { TRANSACTION_REPOSITORY_TOKEN } from "../../../domain/repositories/transaction.repository.token";
import { TransactionItemComponent } from "./components/transaction-item/transaction-item.component";

@Component({
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss',
  imports: [CommonModule, FormsModule, TransactionItemComponent],
})
export class AddTransactionComponent {
  type = signal<TransactionType>('expense');
  amount = 0;
  description = '';
  transactions = signal<Transaction[]>([]);

  constructor(@Inject(TRANSACTION_REPOSITORY_TOKEN) private repo: ITransactionRepository){
    this.loadTransactions();
  }

  setType(t: TransactionType) {
    this.type.set(t);
  }

  isValid(): boolean {
    return this.amount > 0 && this.description.trim().length > 0;
  }

  async save() {
      if (!this.isValid()) return;
      
      await this.repo.add({
          type: this.type(),
          amount: this.amount,
          description: this.description
      });
      
      this.amount = 0;
      this.description = '';
      await this.loadTransactions();
  }

  async delete(id: string) {
    await this.repo.delete(id);
    await this.loadTransactions();
  }

  private async loadTransactions() {
    const all = await this.repo.getAll();
    this.transactions.set(all);
  }
}