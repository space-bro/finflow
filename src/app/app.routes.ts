import { Routes } from '@angular/router';
import { AddTransactionComponent } from './presentation/pages/add-transaction/add-transaction.component';
import { AnalyticsComponent } from './presentation/pages/analytics/analytics.component';

export const routes: Routes = [
    {path: "", component: AddTransactionComponent},
    {path: "analytics", component: AnalyticsComponent}
];
