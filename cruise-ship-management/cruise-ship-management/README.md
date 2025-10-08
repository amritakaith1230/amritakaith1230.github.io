# 🚢 CruiseShip Management System

A comprehensive web application for managing cruise ship operations, built with **Next.js 15**, **TypeScript**, **Firebase**, and **Tailwind CSS**.

## 📋 Project Overview

The CruiseShip Management System is an advanced web application designed to streamline cruise ship operations and enhance passenger experience. It provides role-based access for different user types including passengers (voyagers), administrators, managers, head cooks, and supervisors.

## 🎯 Features

### 👥 User Roles & Permissions

1. **Voyager (Passengers)**

   - Order catering items (meals, snacks, beverages)
   - Order stationery items (gifts, chocolates, books)
   - Book resort movie tickets with seat selection
   - Schedule beauty salon appointments
   - Book fitness center equipment and sessions
   - Reserve party halls for celebrations

2. **Admin**

   - Add, edit, and delete menu items
   - Maintain system-wide menu items
   - Manage voyager registrations
   - User account management
   - System configuration

3. **Manager**

   - View all resort movie ticket bookings
   - Monitor beauty salon bookings
   - Track fitness center bookings
   - Oversee party hall reservations

4. **Head Cook**

   - View and manage catering orders
   - Process food and beverage requests
   - Kitchen operations management

5. **Supervisor**
   - View and manage stationery orders
   - Coordinate gift and supply deliveries
   - Inventory management

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, React 18
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Form Handling**: React Hook Form (planned)
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project setup
- Git for version control

### Installation

1. **Clone the repository**
   \`\`\`bash
   cd cruise-ship-management
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🗄️ Database Schema

### Collections

1. **users**

   - User profiles and authentication data
   - Role-based permissions
   - Cabin assignments for voyagers

2. **menuItems**

   - Catering and stationery items
   - Categories, prices, and availability
   - Admin-managed inventory

3. **orders**

   - User orders for catering and stationery
   - Order status tracking
   - Delivery information

4. **bookings**
   - Facility reservations
   - Time slots and availability
   - Special requirements

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode Support**: Built-in theme switching (planned)
- **Accessibility**: WCAG compliant components
- **Modern Interface**: Clean, intuitive design with shadcn/ui
- **Real-time Updates**: Firebase real-time database integration

## 🔐 Security Features

- **Role-based Access Control**: Secure route protection
- **Firebase Authentication**: Industry-standard security
- **Input Validation**: Client and server-side validation
- **Data Sanitization**: XSS protection
- **Secure API Routes**: Protected endpoints

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing Strategy

- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API route testing
- **E2E Tests**: User journey testing with Cypress
- **Type Safety**: Full TypeScript coverage

**Built with ❤️ for the cruise industry**
