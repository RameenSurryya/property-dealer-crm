# Property Dealer CRM System

A full-stack CRM system for property dealers built with Next.js, MongoDB, Mongoose, JWT authentication, and Tailwind CSS.

## Features

- User signup and login
- Password hashing with bcrypt
- JWT-based authentication using HTTP-only cookies
- Role-based access control for Admin and Agent
- Lead CRUD operations
- Lead assignment and reassignment
- Rule-based lead scoring
  - Budget above 20M = High priority
  - Budget 10M to 20M = Medium priority
  - Budget below 10M = Low priority
- Activity timeline / audit trail
- Follow-up reminder system
- Overdue and stale lead detection
- Admin analytics dashboard
- Agent dashboard
- WhatsApp click-to-chat integration
- Email notification helper
- Polling-based live dashboard updates
- Responsive UI using Tailwind CSS

## Tech Stack

- Next.js App Router
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Tailwind CSS
- Nodemailer
- Polling for real-time-style updates

## Environment Variables

Create a `.env.local` file using `.env.example`.

```env
MONGODB_URI=
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

EMAIL_USER=
EMAIL_PASS=