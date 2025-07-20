import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Bill, BillService, Appointment, Service, Customer } from '../../models/appointment.model';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  bills: Bill[] = [];
  appointments: Appointment[] = [];
  services: Service[] = [];
  customers: Customer[] = [];
  filteredBills: Bill[] = [];
  
  billForm: FormGroup;
  showForm = false;
  editingBill: Bill | null = null;
  searchTerm = '';
  filterStatus = 'all';

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.billForm = this.fb.group({
      appointmentId: [''],
      customerName: ['', Validators.required],
      services: this.fb.array([]),
      discount: [0, [Validators.min(0), Validators.max(100)]],
      tax: [8.5, [Validators.min(0), Validators.max(50)]],
      paymentMethod: ['cash', Validators.required],
      paymentStatus: ['pending', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getBills().subscribe(bills => {
      this.bills = bills;
      this.filterBills();
    });

    this.dataService.getAppointments().subscribe(appointments => {
      this.appointments = appointments.filter(a => a.status === 'completed');
    });

    this.dataService.getServices().subscribe(services => {
      this.services = services.filter(s => s.isActive);
    });

    this.dataService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  get servicesFormArray(): FormArray {
    return this.billForm.get('services') as FormArray;
  }

  showNewBillForm(): void {
    this.showForm = true;
    this.editingBill = null;
    this.billForm.reset({
      discount: 0,
      tax: 8.5,
      paymentMethod: 'cash',
      paymentStatus: 'pending'
    });
    this.servicesFormArray.clear();
    this.addServiceRow();
  }

  editBill(bill: Bill): void {
    this.showForm = true;
    this.editingBill = bill;
    
    // Clear existing services
    this.servicesFormArray.clear();
    
    // Add services from bill
    bill.services.forEach(service => {
      this.servicesFormArray.push(this.fb.group({
        serviceId: [service.serviceId, Validators.required],
        quantity: [service.quantity, [Validators.required, Validators.min(1)]],
        price: [service.price, [Validators.required, Validators.min(0)]]
      }));
    });

    this.billForm.patchValue({
      appointmentId: bill.appointmentId,
      customerName: bill.customerName,
      discount: bill.discount,
      tax: bill.tax,
      paymentMethod: bill.paymentMethod,
      paymentStatus: bill.paymentStatus,
      notes: bill.notes
    });
  }

  addServiceRow(): void {
    const serviceGroup = this.fb.group({
      serviceId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    // Update price when service changes
    serviceGroup.get('serviceId')?.valueChanges.subscribe(serviceId => {
      const service = this.services.find(s => s.id === serviceId);
      if (service) {
        serviceGroup.patchValue({ price: service.price });
      }
    });

    this.servicesFormArray.push(serviceGroup);
  }

  removeServiceRow(index: number): void {
    this.servicesFormArray.removeAt(index);
  }

  onAppointmentSelect(): void {
    const appointmentId = this.billForm.get('appointmentId')?.value;
    if (appointmentId) {
      const appointment = this.appointments.find(a => a.id === appointmentId);
      if (appointment) {
        this.billForm.patchValue({
          customerName: appointment.customerName
        });

        // Clear existing services and add appointment service
        this.servicesFormArray.clear();
        this.servicesFormArray.push(this.fb.group({
          serviceId: [appointment.serviceId, Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]],
          price: [appointment.price, [Validators.required, Validators.min(0)]]
        }));
      }
    }
  }

  calculateSubtotal(): number {
    return this.servicesFormArray.controls.reduce((total, service) => {
      const quantity = service.get('quantity')?.value || 0;
      const price = service.get('price')?.value || 0;
      return total + (quantity * price);
    }, 0);
  }

  calculateTax(): number {
    const subtotal = this.calculateSubtotal();
    const taxRate = this.billForm.get('tax')?.value || 0;
    return (subtotal * taxRate) / 100;
  }

  calculateDiscount(): number {
    const subtotal = this.calculateSubtotal();
    const discountRate = this.billForm.get('discount')?.value || 0;
    return (subtotal * discountRate) / 100;
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    const discount = this.calculateDiscount();
    return subtotal + tax - discount;
  }

  saveBill(): void {
    if (this.billForm.valid && this.servicesFormArray.length > 0) {
      const formValue = this.billForm.value;
      
      const billServices: BillService[] = formValue.services.map((service: any) => {
        const selectedService = this.services.find(s => s.id === service.serviceId);
        return {
          serviceId: service.serviceId,
          serviceName: selectedService?.name || '',
          quantity: service.quantity,
          price: service.price,
          total: service.quantity * service.price
        };
      });

      const subtotal = this.calculateSubtotal();
      const tax = this.calculateTax();
      const discount = this.calculateDiscount();
      const total = this.calculateTotal();

      const billData: Bill = {
        id: this.editingBill?.id || this.dataService.generateId(),
        appointmentId: formValue.appointmentId || '',
        customerId: this.editingBill?.customerId || this.dataService.generateId(),
        customerName: formValue.customerName,
        services: billServices,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        total: total,
        paymentMethod: formValue.paymentMethod,
        paymentStatus: formValue.paymentStatus,
        date: this.editingBill?.date || new Date(),
        notes: formValue.notes
      };

      this.dataService.addBill(billData);
      this.cancelForm();
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingBill = null;
    this.billForm.reset();
    this.servicesFormArray.clear();
  }

  updatePaymentStatus(bill: Bill, status: string): void {
    const updatedBill = { ...bill, paymentStatus: status as any };
    // Note: In a real app, you'd have an update method in the service
    console.log('Update payment status:', updatedBill);
  }

  printBill(bill: Bill): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generateBillHTML(bill));
      printWindow.document.close();
      printWindow.print();
    }
  }

  generateBillHTML(bill: Bill): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${bill.customerName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .customer-info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; }
          .totals { margin-top: 20px; }
          .total-row { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Alicia Beauty Art</h1>
          <h2>Invoice</h2>
          <p>Date: ${new Date(bill.date).toLocaleDateString()}</p>
          <p>Bill #: ${bill.id}</p>
        </div>
        
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${bill.customerName}</strong></p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${bill.services.map(service => `
              <tr>
                <td>${service.serviceName}</td>
                <td>${service.quantity}</td>
                <td>${this.formatCurrency(service.price)}</td>
                <td>${this.formatCurrency(service.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <p>Subtotal: ${this.formatCurrency(bill.subtotal)}</p>
          <p>Tax: ${this.formatCurrency(bill.tax)}</p>
          <p>Discount: ${this.formatCurrency(bill.discount)}</p>
          <p class="total-row">Total: ${this.formatCurrency(bill.total)}</p>
          <p>Payment Method: ${bill.paymentMethod}</p>
          <p>Payment Status: ${bill.paymentStatus}</p>
        </div>
        
        ${bill.notes ? `<div class="notes"><h3>Notes:</h3><p>${bill.notes}</p></div>` : ''}
      </body>
      </html>
    `;
  }

  filterBills(): void {
    let filtered = [...this.bills];

    // Filter by payment status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(b => b.paymentStatus === this.filterStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.customerName.toLowerCase().includes(term) ||
        b.id.toLowerCase().includes(term)
      );
    }

    this.filteredBills = filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  onFilterChange(): void {
    this.filterBills();
  }

  onSearchChange(): void {
    this.filterBills();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getPaymentStatusClass(status: string): string {
    return `status-${status}`;
  }

  getPaymentStatusIcon(status: string): string {
    switch (status) {
      case 'paid': return '✅';
      case 'pending': return '⏳';
      case 'partial': return '⚠️';
      case 'refunded': return '↩️';
      default: return '⏳';
    }
  }
}