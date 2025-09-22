# n8n Clone - Workflow Automation Platform

A beautiful, production-ready n8n-inspired workflow automation platform built with React, TypeScript, and Tailwind CSS. This is a frontend-only application with complete mock functionality and localStorage persistence.

![n8n Clone Screenshot](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600)

## ✨ Features

### 🔐 Authentication
- **Login/Signup**: Full authentication flow with form validation
- **Mock Users**: Demo credentials for testing
- **Remember Me**: Session persistence option
- **Protected Routes**: Automatic redirects for unauthorized access

### 🏠 Dashboard & Overview
- **Summary Cards**: Workflow stats, execution metrics, failure rates
- **Recent Activity**: Latest workflow runs and updates  
- **Quick Actions**: Create workflows, browse templates, manage users
- **Workspace Overview**: Team information and performance charts

### ⚡ Workflow Management
- **Workflow List**: Search, filter, sort, and paginate workflows
- **Visual Editor**: Node-based workflow canvas with drag-and-drop UI
- **Node Inspector**: Configure parameters and settings for each node
- **Execution History**: Track workflow runs and performance
- **CRUD Operations**: Create, edit, duplicate, and delete workflows

### 🎨 Modern UI/UX
- **Dark/Light Themes**: Toggle between themes with persistence
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Smooth Animations**: Loading states, transitions, and micro-interactions
- **Toast Notifications**: User feedback for all actions
- **Accessibility**: Semantic HTML, focus management, keyboard navigation

### 🛠 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Mock Data**: Realistic workflow and execution data
- **localStorage**: Client-side persistence for all user data
- **Context API**: Global state management for auth and theme
- **Component Library**: Reusable shadcn/ui components
- **Modern Routing**: React Router with nested layouts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd n8n-clone

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Demo Credentials
Use these credentials to log in and explore the app:

- **Email**: `john@example.com`
- **Password**: `password123`

Additional test accounts:
- `jane@example.com` / `password123`
- `mike@example.com` / `password123`

## 📱 Screenshots

### Login Page
Clean authentication interface with validation and demo credentials display.

### Dashboard
Overview with execution statistics, recent workflows, and quick action buttons.

### Workflow List
Searchable and filterable list of workflows with status indicators and actions.

### Workflow Editor
Visual node-based editor with toolbox, canvas, and property inspector panels.

### Settings
Comprehensive settings with profile management, theme toggle, and preferences.

## 🏗 Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Header)
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts for global state
├── hooks/              # Custom React hooks
├── lib/                # Utilities and mock data
├── pages/              # Route components
└── styles/             # Global CSS and design system
```

### Key Technologies
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type safety and better developer experience  
- **Tailwind CSS** - Utility-first CSS with custom design system
- **React Router** - Client-side routing with protected routes
- **shadcn/ui** - Beautiful, accessible UI component library
- **Lucide React** - Modern icon library
- **localStorage** - Client-side data persistence

### Design System
The app features a comprehensive design system inspired by n8n:
- **Colors**: Dark theme with orange (#FF6B35) accent colors
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Custom variants for buttons, cards, and form elements
- **Animations**: Smooth transitions and micro-interactions

## 🎯 Mock Data & Functionality

### Authentication
- Mock user accounts with different roles (Admin, Editor, Viewer)
- Session management with localStorage
- Password validation and error handling

### Workflows
- 5 sample workflows with realistic names and descriptions
- Status tracking (active/inactive)
- Execution history and metrics
- Tags and categorization

### Executions
- Mock execution logs with timestamps
- Success/error/running states
- Performance metrics and duration tracking

### Node Types
- Webhook triggers
- Email and messaging actions
- AI agents and form handlers
- Conditional logic nodes

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality  
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📊 Data Persistence

All user data is stored in localStorage:
- **Authentication**: User sessions and login state
- **Preferences**: Theme selection and settings
- **Workflows**: CRUD operations persist across sessions
- **Mock Executions**: Simulated workflow run history

Data is automatically loaded on app initialization and updated in real-time.

## 🎨 Customization

### Theme Customization
Edit `src/index.css` to modify the design system:
```css
:root {
  --primary: 14 100% 60%;        /* Orange accent */
  --n8n-canvas: 220 13% 18%;     /* Dark background */
  --n8n-sidebar: 220 13% 14%;    /* Sidebar color */
}
```

### Mock Data
Update `src/lib/mockData.ts` to customize:
- User accounts and roles
- Workflow templates
- Node types and categories
- Execution history

## 📋 Roadmap

Future enhancements could include:
- [ ] Real backend integration
- [ ] Actual drag-and-drop workflow building
- [ ] Advanced node configuration
- [ ] Workflow templates library
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Mobile app version

## 🤝 Contributing

This is a demo project, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by [n8n](https://n8n.io) - the amazing workflow automation platform
- Built with [Lovable](https://lovable.dev) - AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

**Note**: This is a frontend-only demo application. All functionality is mocked and no real workflow execution occurs. For production use, integrate with a real backend service.