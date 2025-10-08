# 💰 MERN Stack Expense Tracker

A full-featured expense tracking application built with MongoDB, Express.js, React.js, and Node.js.

## ✨ Features

### Core Features

- 📊 **Transaction Management**: Add, edit, and delete income/expense transactions
- 🏷️ **Smart Categorization**: Organize transactions by categories
- 💰 **Real-time Calculations**: Automatic calculation of totals and net income
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ✅ **Input Validation**: Both frontend and backend validation
- 💾 **Data Persistence**: MongoDB database with local storage backup

### Advanced Features

- 🔍 **Smart Filtering**: Filter by type, category, or date range
- 📈 **Visual Analytics**: Category breakdown with percentages
- ✏️ **Edit Transactions**: Update existing transactions easily
- 🎨 **Modern UI**: Beautiful gradient design with interactive elements
- 🔔 **Toast Notifications**: Real-time feedback for user actions
- 📊 **Summary Dashboard**: Overview of financial health

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone and setup backend**
   \`\`\`bash

   cd expense-tracker
   cd backend
   npm init -y
   npm install -D nodemon
   \`\`\`

\`\`\`

3. **Start the server**
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup

1. **Create React app**
   \`\`\`bash
   cd expense-tracker
   cd frontend
   npm install
   \`\`\`

2. **Start the frontend**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🛠️ API Endpoints

### Transactions

- \`GET /api/transactions\` - Get all transactions
- \`POST /api/transactions\` - Create new transaction
- \`PUT /api/transactions/:id\` - Update transaction
- \`DELETE /api/transactions/:id\` - Delete transaction
- \`GET /api/transactions/summary\` - Get financial summary
- \`GET /api/transactions/categories\` - Get all categories

### Query Parameters

- \`type\`: Filter by 'income' or 'expense'
- \`category\`: Filter by category name
- \`startDate\`: Filter from date (YYYY-MM-DD)
- \`endDate\`: Filter to date (YYYY-MM-DD)

## 💡 Usage Guide

### Adding Transactions

1. Select transaction type (Income/Expense)
2. Enter amount, description, and category
3. Choose date
4. Click "Add Transaction"

### Managing Transactions

- **Edit**: Click the edit button (✏️) on any transaction
- **Delete**: Click the delete button (🗑️) to remove
- **Filter**: Use the dropdown to filter by type or category

### Understanding the Dashboard

- **Green Card**: Total income
- **Red Card**: Total expenses
- **Blue Card**: Net income (income - expenses)
- **Purple Card**: Total transaction count

## 🎨 Customization

### Adding New Categories

Edit the categories object in the frontend:

\`\`\`javascript
const categories = {
income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
expense: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other']
}
\`\`\`

### Styling

The app uses Tailwind CSS with custom gradients. Modify the color scheme in:

- \`tailwind.config.js\`
- Component className props

## 🔧 Environment Variables

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
\`\`\`

## 📱 Mobile Responsiveness

The app is fully responsive with:

- Mobile-first design approach
- Touch-friendly buttons and inputs
- Optimized layouts for all screen sizes
- Swipe gestures support

## 🚀 Deployment

### Backend (Railway/Heroku)

1. Push code to GitHub
2. Connect to Railway/Heroku
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set build command: \`npm run build\`
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: \`git checkout -b feature-name\`
3. Commit changes: \`git commit -am 'Add feature'\`
4. Push to branch: \`git push origin feature-name\`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check API endpoints are working

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] Budget planning and alerts
- [ ] Data export (CSV, PDF)
- [ ] Advanced charts and analytics
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Receipt photo uploads
- [ ] Expense sharing with family/friends

---

Made with ❤️ using MERN Stack
\`\`\`
