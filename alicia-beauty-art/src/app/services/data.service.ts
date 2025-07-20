import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment, Customer, Service, Bill, DashboardStats, BillService } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private appointments = new BehaviorSubject<Appointment[]>([]);
  private customers = new BehaviorSubject<Customer[]>([]);
  private services = new BehaviorSubject<Service[]>([]);
  private bills = new BehaviorSubject<Bill[]>([]);

  constructor() {
    this.initializeMockData();
  }

  // Appointments
  getAppointments(): Observable<Appointment[]> {
    return this.appointments.asObservable();
  }

  addAppointment(appointment: Appointment): void {
    const currentAppointments = this.appointments.value;
    this.appointments.next([...currentAppointments, appointment]);
  }

  updateAppointment(appointment: Appointment): void {
    const currentAppointments = this.appointments.value;
    const index = currentAppointments.findIndex(a => a.id === appointment.id);
    if (index !== -1) {
      currentAppointments[index] = appointment;
      this.appointments.next([...currentAppointments]);
    }
  }

  deleteAppointment(id: string): void {
    const currentAppointments = this.appointments.value;
    this.appointments.next(currentAppointments.filter(a => a.id !== id));
  }

  // Customers
  getCustomers(): Observable<Customer[]> {
    return this.customers.asObservable();
  }

  addCustomer(customer: Customer): void {
    const currentCustomers = this.customers.value;
    this.customers.next([...currentCustomers, customer]);
  }

  updateCustomer(customer: Customer): void {
    const currentCustomers = this.customers.value;
    const index = currentCustomers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      currentCustomers[index] = customer;
      this.customers.next([...currentCustomers]);
    }
  }

  // Services
  getServices(): Observable<Service[]> {
    return this.services.asObservable();
  }

  addService(service: Service): void {
    const currentServices = this.services.value;
    this.services.next([...currentServices, service]);
  }

  updateService(service: Service): void {
    const currentServices = this.services.value;
    const index = currentServices.findIndex(s => s.id === service.id);
    if (index !== -1) {
      currentServices[index] = service;
      this.services.next([...currentServices]);
    }
  }

  // Bills
  getBills(): Observable<Bill[]> {
    return this.bills.asObservable();
  }

  addBill(bill: Bill): void {
    const currentBills = this.bills.value;
    this.bills.next([...currentBills, bill]);
  }

  // Dashboard Stats
  getDashboardStats(): DashboardStats {
    const currentAppointments = this.appointments.value;
    const currentBills = this.bills.value;
    const currentCustomers = this.customers.value;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppointments = currentAppointments.filter(a => {
      const appointmentDate = new Date(a.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    });

    const todayBills = currentBills.filter(b => {
      const billDate = new Date(b.date);
      billDate.setHours(0, 0, 0, 0);
      return billDate.getTime() === today.getTime();
    });

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyBills = currentBills.filter(b => new Date(b.date) >= thisMonth);

    return {
      todayAppointments: todayAppointments.length,
      todayRevenue: todayBills.reduce((sum, b) => sum + b.total, 0),
      monthlyRevenue: monthlyBills.reduce((sum, b) => sum + b.total, 0),
      totalCustomers: currentCustomers.length,
      pendingAppointments: currentAppointments.filter(a => a.status === 'scheduled').length,
      completedAppointments: currentAppointments.filter(a => a.status === 'completed').length,
      revenueGrowth: 15.5, // Mock growth percentage
      customerGrowth: 8.2   // Mock growth percentage
    };
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private initializeMockData(): void {
    // Mock Services
    const mockServices: Service[] = [
      { id: '1', name: 'Facial Treatment', description: 'Deep cleansing facial with moisturizing', duration: 60, price: 80, category: 'Facial', isActive: true },
      { id: '2', name: 'Manicure', description: 'Classic nail care and polish', duration: 45, price: 35, category: 'Nails', isActive: true },
      { id: '3', name: 'Pedicure', description: 'Foot care with polish and massage', duration: 60, price: 45, category: 'Nails', isActive: true },
      { id: '4', name: 'Hair Cut & Style', description: 'Professional haircut and styling', duration: 90, price: 65, category: 'Hair', isActive: true },
      { id: '5', name: 'Hair Color', description: 'Full hair coloring service', duration: 120, price: 120, category: 'Hair', isActive: true },
      { id: '6', name: 'Eyebrow Threading', description: 'Precision eyebrow shaping', duration: 20, price: 25, category: 'Facial', isActive: true },
      { id: '7', name: 'Makeup Application', description: 'Professional makeup for special events', duration: 45, price: 75, category: 'Makeup', isActive: true }
    ];

    // Mock Customers
    const mockCustomers: Customer[] = [
      { id: '1', name: 'Sarah Johnson', phone: '+1-555-0101', email: 'sarah.j@email.com', totalVisits: 12, totalSpent: 960, lastVisit: new Date('2024-01-15'), createdAt: new Date('2023-06-15') },
      { id: '2', name: 'Emma Wilson', phone: '+1-555-0102', email: 'emma.w@email.com', totalVisits: 8, totalSpent: 640, lastVisit: new Date('2024-01-10'), createdAt: new Date('2023-08-20') },
      { id: '3', name: 'Olivia Brown', phone: '+1-555-0103', email: 'olivia.b@email.com', totalVisits: 15, totalSpent: 1200, lastVisit: new Date('2024-01-12'), createdAt: new Date('2023-05-10') },
      { id: '4', name: 'Ava Davis', phone: '+1-555-0104', email: 'ava.d@email.com', totalVisits: 6, totalSpent: 480, lastVisit: new Date('2024-01-08'), createdAt: new Date('2023-09-25') },
      { id: '5', name: 'Isabella Miller', phone: '+1-555-0105', email: 'isabella.m@email.com', totalVisits: 10, totalSpent: 800, lastVisit: new Date('2024-01-14'), createdAt: new Date('2023-07-12') }
    ];

    // Mock Appointments
    const mockAppointments: Appointment[] = [
      {
        id: '1', customerId: '1', customerName: 'Sarah Johnson', customerPhone: '+1-555-0101', customerEmail: 'sarah.j@email.com',
        serviceId: '1', serviceName: 'Facial Treatment', duration: 60, price: 80,
        date: new Date(), time: '10:00', status: 'scheduled', createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: '2', customerId: '2', customerName: 'Emma Wilson', customerPhone: '+1-555-0102', customerEmail: 'emma.w@email.com',
        serviceId: '2', serviceName: 'Manicure', duration: 45, price: 35,
        date: new Date(), time: '14:00', status: 'scheduled', createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: '3', customerId: '3', customerName: 'Olivia Brown', customerPhone: '+1-555-0103', customerEmail: 'olivia.b@email.com',
        serviceId: '4', serviceName: 'Hair Cut & Style', duration: 90, price: 65,
        date: new Date(Date.now() + 86400000), time: '11:00', status: 'scheduled', createdAt: new Date(), updatedAt: new Date()
      }
    ];

    // Mock Bills
    const mockBills: Bill[] = [
      {
        id: '1', appointmentId: '1', customerId: '1', customerName: 'Sarah Johnson',
        services: [{ serviceId: '1', serviceName: 'Facial Treatment', quantity: 1, price: 80, total: 80 }],
        subtotal: 80, tax: 8, discount: 0, total: 88,
        paymentMethod: 'card', paymentStatus: 'paid', date: new Date()
      }
    ];

    this.services.next(mockServices);
    this.customers.next(mockCustomers);
    this.appointments.next(mockAppointments);
    this.bills.next(mockBills);
  }
}