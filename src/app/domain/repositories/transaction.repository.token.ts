import { InjectionToken } from "@angular/core";
import { ITransactionRepository } from "./transaction.repository.interface";

export const TRANSACTION_REPOSITORY_TOKEN = new InjectionToken<ITransactionRepository>("TransactionRepository");