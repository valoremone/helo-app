# HELO Admin Control Panel

![HELO Logo](admin/public/HELO-full-logo-dark.svg)

## Overview

The HELO Admin Control Panel is a comprehensive management system designed for aviation operations administration. This platform offers a centralized solution for managing fleet operations, customer bookings, user accounts, reporting, and system configuration all within a sleek and intuitive interface.

## Features

### Dashboard
- Real-time overview of key business metrics
- Quick access to critical notifications
- System status and health monitoring
- Performance indicators and trends

### User Management
- **All Users:** Comprehensive user database with filtering and search
- **Roles & Permissions:** Granular access control system
- **Activity Logs:** Detailed tracking of user activity
- **Memberships:** Manage customer membership tiers and benefits

### Bookings Management
- **All Bookings:** Complete list of reservations with detailed information
- **Calendar View:** Visual scheduling interface
- **Pending Approvals:** Review and manage booking requests
- **Booking History:** Historical record of completed bookings

### Fleet Management
- **Aircraft List:** Detailed inventory of all aircraft
- **Maintenance:** Schedule and track maintenance activities
- **Flight Schedule:** Comprehensive flight planning
- **Routes:** Manage flight routes and destinations

### Content Management
- **Membership Tiers:** Configure membership levels and benefits
- **Routes & Destinations:** Manage available flight routes
- **Pricing:** Control pricing structure and special offers
- **Services:** Configure available services and amenities

### Reports
- **Analytics Dashboard:** Advanced data visualization with real-time metrics
- **Financial Reports:** Revenue tracking, forecasting, and analysis
- **Flight Reports:** Operational performance metrics
- **Maintenance Reports:** Service history and scheduling analysis

### Settings
- **General:** System-wide configuration options
- **Notifications:** Communication preferences and templates
- **Security:** System security settings and protocols
- **System Logs:** Technical operations tracking
- **Performance:** System optimization tools

## Technology Stack

- **Frontend:** React with TypeScript
- **State Management:** Redux
- **Styling:** Tailwind CSS with shadcn/ui components
- **Charts & Data Visualization:** Recharts
- **Calendar:** react-big-calendar
- **Date Handling:** date-fns
- **Icons:** Lucide React

## Installation

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/organization/helo-admin.git
   cd helo-admin
   ```

2. Install dependencies:
   ```bash
   cd admin
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration settings.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:5173/admin/`

## Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be located in the `dist` directory.

## Project Structure

```
admin/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components (sidebar, header, etc.)
│   │   └── ui/          # UI components (buttons, forms, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and constants
│   ├── pages/           # Application pages
│   │   ├── bookings/    # Booking management pages
│   │   ├── customers/   # Customer management pages
│   │   ├── fleet/       # Fleet management pages
│   │   ├── reports/     # Reporting pages
│   │   └── settings/    # System settings pages
│   ├── store/           # Redux store configuration
│   │   └── slices/      # Redux slices for state management
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── routes.tsx       # Application routing
└── index.html           # HTML entry point
```

## Authentication and Authorization

The system implements role-based access control (RBAC) to ensure that users only have access to the functionality appropriate for their role. The main roles are:

- **Administrator:** Full access to all system functions
- **Manager:** Access to operational features excluding system settings
- **Staff:** Limited access to day-to-day operational tools
- **Viewer:** Read-only access to non-sensitive information

## Development Guidelines

### Code Style
- Follow the TypeScript style guide
- Use functional components with hooks
- Use shadcn/ui components when available
- Implement responsive design using Tailwind CSS
- Implement proper error handling and loading states

### State Management
- Use Redux for global state management
- Use React Query for server state
- Use local state for component-specific concerns

### Testing
- Write unit tests for utility functions
- Write component tests for UI components
- Perform integration tests for complex workflows

## API Integration

The admin panel connects to the HELO API for data operations. The API base URL is configured in the environment variables and all requests should include proper authentication headers.

## Deployment

### Requirements
- Node.js environment
- Web server (Nginx, Apache, etc.)
- HTTPS certificate for production

### Deployment Steps
1. Build the application using `npm run build`
2. Copy the contents of the `dist` directory to your web server
3. Configure your web server to serve the application
4. Set up proper CORS and security headers

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed information about version changes.

## Support

For technical support, please contact the development team at [support@flyhelo.one](mailto:support@flyhelo.one).

## License

Copyright © 2024 HELO Aviation Services. All rights reserved. 