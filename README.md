# Nanna's Pizza 🍕

**A full-stack pizza ordering application built with React, Supabase, and modern web technologies.**

Nanna's Pizza is a full-stack web application for a fictional, family-style pizzeria. Customers can browse the menu, place orders, and track their order status, while staff, delivery personnel, and administrators use dedicated interfaces to manage daily operations.

The project focuses on more than the customer-facing interface. It includes a Supabase backend, server-side order and price validation, role-based access control, database security policies, and separate workflows for customer orders, staff, delivery, and administration.

**Live Demo:** Coming soon
**GitHub Repository:** Add repository URL after publishing

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Security](#security)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Demo Access](#demo-access)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Project Overview

Nanna's Pizza was developed as a portfolio project to demonstrate the development of a modern React application connected to a real backend.

The application combines a responsive customer experience with operational tools for a small restaurant. It uses dedicated services and React Query hooks to separate data access from UI components, Redux Toolkit to manage the shopping cart, and Supabase for database access, authentication, storage, and server-side operations.

The payment flow currently uses a simulated payment process. No real payment provider is connected.

## Features

### Customer Experience

- Browse the pizza menu and view ingredients, descriptions, prices, and availability.
- Add pizzas to the cart and adjust quantities.
- Review the cart and enter customer and delivery details at checkout.
- Place orders through a backend-validated order creation flow.
- Complete the simulated payment process.
- View order confirmation and track order status.
- Access order tracking using an order-specific access token.

### Staff Operations

- Dedicated staff login and account setup flows.
- Password reset functionality.
- View incoming orders and order details.
- Update orders through permitted preparation statuses.
- Access staff-specific operational information.

### Delivery Workflow

- Dedicated delivery interface.
- View assigned or available delivery workflow information as implemented by the application.
- Update delivery status through the permitted workflow.
- Mark orders as out for delivery and delivered.

### Administration

- Separate admin authentication and dashboard.
- Dashboard metrics and sales summaries.
- Revenue, order, payment, and pizza performance visualizations.
- Order search, filtering, and detail views.
- Pizza management, including creation, editing, availability, and image uploads.
- Team management for staff and delivery accounts.
- Activate or deactivate team members where permitted.
- Role-aware access to administrative features.

### User Interface

- Responsive layouts for desktop and mobile devices.
- Reusable React components.
- Consistent visual design with custom Tailwind CSS styling.
- Form validation and submission feedback.
- Charts and dashboard summaries for operational insights.

## Technology Stack

### Frontend

- **React** — component-based user interface.
- **Vite** — development server and production build.
- **React Router** — application routing.
- **Redux Toolkit and React Redux** — shopping cart state management.
- **TanStack React Query** — server-state fetching, caching, and mutations.
- **Tailwind CSS** — responsive styling and design system.
- **React Hook Form** — form state and validation.
- **Recharts** — dashboard charts and analytics.
- **Lucide React and React Icons** — interface icons.

### Backend and Infrastructure

- **Supabase Database** — PostgreSQL database for pizzas, orders, order items, profiles, and related data.
- **Supabase Auth** — staff and administrative authentication.
- **Supabase Edge Functions** — server-side operations for order creation, simulated payment completion, and team management.
- **Supabase Row Level Security (RLS)** — database access restrictions.
- **Supabase Storage** — pizza image storage.
- **Supabase Realtime** — live order status updates where configured.

### Development Tools

- JavaScript with ES modules.
- ESLint.
- Prettier.

## Application Architecture

The application separates UI components, data access, and server-side responsibilities.

### Frontend data flow

- React components render the customer and operational interfaces.
- Redux Toolkit manages client-side cart state.
- React Hook Form manages form input and validation.
- Service modules centralize Supabase requests and business-operation calls.
- TanStack React Query manages server data, mutations, caching, and relevant query invalidation.

### Order creation and payment flow

1. The customer submits checkout details and selected pizza IDs and quantities.
2. A Supabase Edge Function processes the order request.
3. The backend validates order data and calculates the total using trusted database prices rather than relying on client-submitted prices.
4. The order is created, and an order-specific access token is returned for customer order tracking.
5. The frontend stores the tracking token in session storage for the current browser session.
6. A separate Edge Function completes the simulated payment flow.
7. After successful payment completion, the frontend clears the cart and navigates to the order confirmation page.

### Staff and administration

Staff and delivery users operate through role-specific interfaces. Administrative operations use protected backend functionality, and access is checked against the user's authenticated identity and role.

## Security

Security is considered at both the frontend and backend levels.

Implemented security measures include:

- PostgreSQL Row Level Security policies for protected data access.
- Server-side price calculation during order creation to prevent trusting manipulated client totals.
- Supabase Edge Functions for privileged operations.
- Role and active-account checks for administrative team management.
- Separate staff and admin login flows.
- Restricted team-management roles and protected administrative actions.
- Order access tokens, with token hashes stored in the database for order access.
- Environment variables for frontend Supabase configuration rather than hardcoding configuration values in source files.

**Important:** The frontend publishable key is not a substitute for database security. Authorization must be enforced by RLS policies and server-side checks. Privileged service-role keys must never be exposed in browser code or committed to the repository.

The production deployment should be reviewed separately to ensure that authentication redirects, Edge Function secrets, RLS policies, storage permissions, and demo accounts are configured appropriately.

## Getting Started

### Prerequisites

- Node.js and npm.
- A Supabase project.
- Git.

### 1. Clone the repository

After the repository is published, run:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd nannas_pizza
```

Replace the placeholder with the actual repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the required frontend Supabase configuration:

```dotenv
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Use the values from your own Supabase project. Never commit `.env.local` or put privileged secrets in `VITE_` variables.

### 4. Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

### 5. Run the production build

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

**Note:** The frontend requires a correctly configured Supabase project, including the database schema, RLS policies, Edge Functions, storage configuration, and authentication settings. Environment variables alone do not provision the backend.

## Available Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Starts the Vite development server.              |
| `npm run build`   | Creates the production build in `dist/`.         |
| `npm run preview` | Serves the production build locally for preview. |
| `npm run lint`    | Runs ESLint checks.                              |

## Demo Access

**Live application:** Coming soon.

Demo accounts and instructions will be provided here after the production deployment has been secured.

Only dedicated test accounts with fictional data should be used for public demonstrations. Do not publish real staff credentials, administrator passwords, private customer data, or privileged API keys.

## Screenshots

Screenshots of the customer menu, checkout, order tracking, staff interface, and admin dashboard will be added here.

## Future Improvements

Potential future improvements include:

- Integration with a real payment provider.
- Automated end-to-end testing of key customer and staff workflows.
- Further accessibility and performance testing.
- Additional production monitoring and operational reporting.

## Author

**Martin Trajkovski**

Frontend developer, focused on building responsive applications with React and modern web technologies.

This project demonstrates my work with React state management, server-state caching, Supabase integration, database security, Edge Functions, authentication, and role-based application workflows.

- **Portfolio:** Add portfolio URL.
- **GitHub:** Add GitHub profile URL.
