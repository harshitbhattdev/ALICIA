import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { DashboardStats, Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentAppointments: Appointment[] = [];
  revenueChartData: any[] = [];
  currentDate = new Date();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadRecentAppointments();
    this.generateRevenueChartData();
  }

  loadDashboardData(): void {
    this.stats = this.dataService.getDashboardStats();
  }

  loadRecentAppointments(): void {
    this.dataService.getAppointments().subscribe(appointments => {
      this.recentAppointments = appointments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    });
  }

  generateRevenueChartData(): void {
    // Generate mock revenue data for the last 7 days
    const today = new Date();
    this.revenueChartData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const revenue = Math.floor(Math.random() * 500) + 200; // Random revenue between 200-700
      
      this.revenueChartData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: revenue
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'no-show': return 'status-no-show';
      default: return '';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatTime(time: string): string {
    return time;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}