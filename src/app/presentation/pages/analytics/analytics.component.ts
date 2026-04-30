import { Component, computed, ElementRef, Inject, OnInit, signal, ViewChild } from "@angular/core";
import { TRANSACTION_REPOSITORY_TOKEN } from "../../../domain/repositories/transaction.repository.token";
import { ArcElement, Chart, Legend, PieController, Tooltip } from "chart.js";
import { Category } from "../../../domain/entities/category";
import { ITransactionRepository } from "../../../domain/repositories/transaction.repository.interface";
import { CategoryRepository } from "../../../infrastructure/repositories/category.repository";
import { CommonModule } from "@angular/common";
import { Transaction } from "../../../domain/entities/transaction";

// Регистрируем нужные компоненты Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend);
@Component({
  imports: [CommonModule],
  templateUrl: "./analytics.component.html",
  styleUrl: "./analytics.component.scss",
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  
  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  private chart: Chart | null = null;
  
  totalExpenses = computed(() => {
    return this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  // Данные для диаграммы
  private getChartData() {
      const expenses = this.transactions().filter(t => t.type === 'expense');
      const map = new Map<string, { value: number; color: string }>(); // ← явный тип!
      
      for (const tx of expenses) {
          const category = this.categories().find(c => c.id === tx.categoryId);
          const categoryName = category?.name || 'Без категории';
          const color = category?.color || '#9E9E9E';
          const current = map.get(categoryName);
          
          if (current) {
              current.value += tx.amount;
          } else {
              map.set(categoryName, { value: tx.amount, color: color });
          }
      }
      
      return {
          labels: Array.from(map.keys()),
          values: Array.from(map.values()).map(v => v.value),
          colors: Array.from(map.values()).map(v => v.color)
      };
  }
  
  constructor(
    @Inject(TRANSACTION_REPOSITORY_TOKEN) private transactionRepo: ITransactionRepository,
    private categoryRepo: CategoryRepository
  ) {}
  
  async ngOnInit() {
    await this.loadData();
    this.renderChart();
  }
  
  private async loadData() {
    this.categories.set(await this.categoryRepo.getAll());
    this.transactions.set(await this.transactionRepo.getAll());
  }
  
  private renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    
    const { labels, values, colors } = this.getChartData();
    
    if (values.length === 0) {
      return;
    }
    
    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = values.reduce((a, b) => a + b, 0);
                const percent = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} ₽ (${percent}%)`;
              }
            }
          }
        }
      }
    });
  }
}
