export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  duration: number; // in minutes
  price: number;
  date: Date;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth?: Date;
  address?: string;
  notes?: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: Date;
  createdAt: Date;
}

export interface Bill {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  services: BillService[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  date: Date;
  notes?: string;
}

export interface BillService {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalCustomers: number;
  pendingAppointments: number;
  completedAppointments: number;
  revenueGrowth: number;
  customerGrowth: number;
}