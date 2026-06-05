# Outgoing Orders — Frontend

A real-time Warehouse Management System (WMS) dashboard for tracking and managing outgoing orders. Built with React, TypeScript, Redux Toolkit, and Material UI.

Inspired by 3.5 years of working on a production WMS at Pulpo WMS, where the outgoing orders page was one of the most complex and frequently improved parts of the system.

## Live Demo

**https://outgoing-orders-frontend.onrender.com**

> **Note:** The backend runs on Render's free tier and may take 30–60 seconds on the first request after inactivity. Subsequent requests are fast.

## Tech Stack

- **Framework:** React 
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **UI Library:** Material UI
- **Real-time:** Socket.io client
- **HTTP Client:** Axios
- **Routing:** React Router

## Features

- **Live dispatch board** — real-time order updates across all connected clients via Socket.io
- **Summary metrics** — at-a-glance count of total, picking, packed, and delayed orders
- **Filtering** — filter orders by status, priority, and date
- **Full CRUD** — create, edit, and delete orders
- **Order detail page** — status timeline showing progression from picking → packed → dispatched with timestamps
- **Consistent status styling** — color-coded badges and timeline nodes per status

## Local Development

### Prerequisites

- Node.js 20+
- The backend running locally or pointed at the Render API

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/outgoing-orders-frontend.git
   cd outgoing-orders-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

To use the live backend instead of running it locally, set:
```
VITE_API_BASE_URL=https://outgoing-orders-backend.onrender.com
```