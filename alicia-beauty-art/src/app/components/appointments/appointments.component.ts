import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Appointment, Customer, Service } from '../../models/appointment.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  customers: Customer[] = [];
  services: Service[] = [];
  filteredAppointments: Appointment[] = [];
  
  appointmentForm: FormGroup;
  showForm = false;
  editingAppointment: Appointment | null = null;
  filterStatus = 'all';
  searchTerm = '';

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      serviceId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
      this.filterAppointments();
    });

    this.dataService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });

    this.dataService.getServices().subscribe(services => {
      this.services = services.filter(s => s.isActive);
    });
  }

  showNewAppointmentForm(): void {
    this.showForm = true;
    this.editingAppointment = null;
    this.appointmentForm.reset();
  }

  editAppointment(appointment: Appointment): void {
    this.showForm = true;
    this.editingAppointment = appointment;
    this.appointmentForm.patchValue({
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      customerEmail: appointment.customerEmail,
      serviceId: appointment.serviceId,
      date: this.formatDateForInput(appointment.date),
      time: appointment.time,
      notes: appointment.notes
    });
  }

  saveAppointment(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const selectedService = this.services.find(s => s.id === formValue.serviceId);
      
      if (!selectedService) return;

      const appointmentData: Appointment = {
        id: this.editingAppointment?.id || this.dataService.generateId(),
        customerId: this.editingAppointment?.customerId || this.dataService.generateId(),
        customerName: formValue.customerName,
        customerPhone: formValue.customerPhone,
        customerEmail: formValue.customerEmail,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        duration: selectedService.duration,
        price: selectedService.price,
        date: new Date(formValue.date),
        time: formValue.time,
        status: this.editingAppointment?.status || 'scheduled',
        notes: formValue.notes,
        createdAt: this.editingAppointment?.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (this.editingAppointment) {
        this.dataService.updateAppointment(appointmentData);
      } else {
        this.dataService.addAppointment(appointmentData);
      }

      this.cancelForm();
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingAppointment = null;
    this.appointmentForm.reset();
  }

  deleteAppointment(appointment: Appointment): void {
    if (confirm(`Are you sure you want to delete the appointment for ${appointment.customerName}?`)) {
      this.dataService.deleteAppointment(appointment.id);
    }
  }

  updateStatus(appointment: Appointment, status: string): void {
    const updatedAppointment = { ...appointment, status: status as any, updatedAt: new Date() };
    this.dataService.updateAppointment(updatedAppointment);
  }

  filterAppointments(): void {
    let filtered = [...this.appointments];

    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === this.filterStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.customerName.toLowerCase().includes(term) ||
        a.serviceName.toLowerCase().includes(term) ||
        a.customerPhone.includes(term)
      );
    }

    this.filteredAppointments = filtered.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  onFilterChange(): void {
    this.filterAppointments();
  }

  onSearchChange(): void {
    this.filterAppointments();
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'scheduled': return '📅';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      case 'no-show': return '🚫';
      default: return '📅';
    }
  }
}