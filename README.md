<img width="1512" height="860" alt="Live dispatch board showing orders across picking, packed and dispatched columns" src="/docs/screenshots/wms-01.png" />
<img width="1512" height="860" alt="Order detail sheet with rush and status stamps, progress ledger and packing list" src="/docs/screenshots/wms-02.png" />

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
- **Running tally** — exact counts of total, picking, packed and dispatched orders across the top of the sheet, from the API's summary endpoint
- **Server-side paging** — each board column loads a few orders at a time with keyset cursors, so the board stays fast with 100k orders
- **Filtering** — filter by status, priority, customer or order number, and date, applied on the server
- **Full CRUD** — create, edit, and delete orders
- **Order detail page** — status timeline showing progression from picking → packed → dispatched with timestamps
- **Status as a stamp** — the current status is stamped on the order sheet, and re-stamps in place when another client advances it
- **Barcode scanning** — `/scan` reads a Code 128 label through the device camera and opens that order; a focused text field takes handheld scanners (which type the code and press Enter) and typed references on every browser

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
