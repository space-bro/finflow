import { Component, computed, EventEmitter, Input, Output } from "@angular/core";
import { Transaction } from "../../../../../domain/entities/transaction";
import { CommonModule } from "@angular/common";
import { Category } from "../../../../../domain/entities/category";

@Component({
    selector: "transaction-item",
    templateUrl: "./transaction-item.component.html",
    styleUrl: "./transaction-item.component.scss",
    imports: [CommonModule]
})
export class TransactionItemComponent {

    /** Транзакция */
    @Input() transaction!: Transaction;

    @Input() categories!: Category[];
    /** Эмиттер удаления */
    @Output() deleteTransaction = new EventEmitter<string>();

    protected category = computed(() => {
        return this.categories.find(c => c.id === this.transaction.categoryId);
    });

    delete() {
        this.deleteTransaction.emit(this.transaction.id);
    }
}