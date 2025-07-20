# Alicia Beauty Art - Salon Management System

A modern, responsive web application for managing beauty salon operations including appointments, billing, services, and customer management.

## 🌟 Features

### 📊 Dashboard
- Beautiful overview with key metrics
- Today's revenue and appointments
- Interactive revenue charts
- Recent appointments list
- Quick action buttons

### 📅 Appointment Management
- Book new appointments
- View all appointments with filtering
- Update appointment status (scheduled, completed, cancelled, no-show)
- Search appointments by customer name, service, or phone
- Edit and delete appointments
- Responsive design for mobile and desktop

### 🧾 Billing System
- Create bills from completed appointments
- Add multiple services to bills
- Automatic tax and discount calculations
- Print-ready bill generation
- Payment status tracking
- Search and filter bills

### 👥 Customer Management (Coming Soon)
- Customer database with contact information
- Visit history and spending analytics
- Customer notes and preferences

### ✨ Service Management (Coming Soon)
- Manage beauty services and pricing
- Service categories and descriptions
- Duration and pricing management

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient backgrounds
- **Responsive**: Works perfectly on iPhone, iPad, and laptop screens
- **Beauty Theme**: Pink and purple color scheme perfect for beauty salons
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Mobile-First**: Optimized for mobile use with touch-friendly interfaces

## 🚀 Technology Stack

- **Frontend**: Angular 18+ with TypeScript
- **Styling**: SCSS with responsive design
- **State Management**: RxJS observables
- **Forms**: Reactive forms with validation
- **Icons**: Emoji-based icons for universal compatibility
- **Build Tool**: Angular CLI

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **iPhone**: Touch-friendly interface with mobile navigation
- **iPad**: Tablet-optimized layouts
- **Laptop/Desktop**: Full-featured desktop experience

## 🏃‍♀️ Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alicia-beauty-art
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard
│   │   ├── appointments/       # Appointment management
│   │   ├── billing/           # Bill creation and management
│   │   ├── services/          # Service management (planned)
│   │   └── customers/         # Customer management (planned)
│   ├── models/                # TypeScript interfaces
│   ├── services/              # Data services
│   └── shared/                # Shared components and utilities
└── styles/                    # Global styles
```

## 🎯 Key Components

### Dashboard Component
- Real-time statistics display
- Revenue charts and analytics
- Recent appointments overview
- Quick action buttons

### Appointments Component
- Full CRUD operations for appointments
- Advanced filtering and search
- Status management
- Mobile-optimized forms

### Billing Component
- Invoice generation with multiple services
- Tax and discount calculations
- Payment tracking
- Print functionality

## 💡 Features in Detail

### Appointment Booking
- Customer information capture
- Service selection with pricing
- Date and time scheduling
- Notes and special requirements

### Bill Generation
- Link to completed appointments
- Multiple services per bill
- Automatic calculations
- Professional invoice printing

### Data Management
- In-memory data storage (can be easily extended to backend)
- Mock data for demonstration
- Reactive data updates across components

## 🎨 Color Scheme

- **Primary**: Pink (#e91e63) to Purple (#9c27b0) gradient
- **Background**: Light pink (#ffeef8) to light purple (#f8f3ff)
- **Success**: Green variants for completed actions
- **Warning**: Orange variants for pending items
- **Error**: Red variants for cancelled/failed items

## 🔧 Customization

The application is designed to be easily customizable:
- Change colors in SCSS variables
- Modify service categories and types
- Add new form fields and data models
- Extend with backend integration

## 📈 Future Enhancements

- [ ] Backend API integration
- [ ] Customer management module
- [ ] Service management module
- [ ] Employee/staff management
- [ ] Inventory tracking
- [ ] SMS/Email notifications
- [ ] Online booking widget
- [ ] Financial reporting
- [ ] Backup and data export

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions about the Alicia Beauty Art salon management system, please contact the development team.

---

**Built with ❤️ for beauty professionals who deserve beautiful software.**
