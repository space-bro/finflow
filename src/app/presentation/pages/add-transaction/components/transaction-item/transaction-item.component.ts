import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Transaction } from "../../../../../domain/entities/transaction";
import { CommonModule } from "@angular/common";

@Component({
    selector: "transaction-item",
    templateUrl: "./transaction-item.component.html",
    styleUrl: "./transaction-item.component.scss",
    imports: [CommonModule]
})
export class TransactionItemComponent {

    /** Транзакция */
    @Input() transaction!: Transaction;
    /** Эмиттер удаления */
    @Output() deleteTransaction = new EventEmitter<string>();

    delete() {
        this.deleteTransaction.emit(this.transaction.id);
    }
}