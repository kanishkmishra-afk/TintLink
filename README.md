# TinyLink

A minimal but complete URL shortener web app similar to bit.ly. Create short links, track clicks, and manage your URLs in one place.

[LIVE LINK](https://tintlink-frontend.onrender.com/)

## Features

- **Create Short Links**: Convert long URLs into short, shareable links with optional custom codes.
-  **Click Tracking**: Track total clicks and last visited time for each link.
-  **Link Management**: View, copy, delete, and update short links from a clean dashboard.
-  **Search & Filter**: Find links by code or target URL.
-  **Detailed Stats**: View detailed statistics for individual links.
-  **Redirect (302)**: Efficient HTTP 302 redirects with automatic click counting.
-  **Health Check**: Built-in `/healthz` endpoint for uptime monitoring.
-  **Responsive UI**: Mobile-friendly interface built with React and Tailwind CSS.
-  **Clean API**: RESTful API following standard conventions.

## Tech Stack

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React 19 + React Router + Tailwind CSS + Vite
- **Database**: MongoDB (Mongoose ORM)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Project Structure

```
TinyLink/
├── backend/
│   ├── controllers/
│   │   └── linksController.js      # Link CRUD and business logic
│   ├── models/
│   │   └── linkModel.js            # MongoDB schema
│   ├── routes/
│   │   ├── linkRoutes.js           # POST/GET/DELETE /api/links/*
│   │   ├── healthRoutes.js         # GET /healthz
│   │   └── redirectRoutes.js       # GET /:code (redirect)
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── index.js                    # Express server entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main page (list, create, search)
│   │   │   ├── Status.jsx          # Stats page for single link
│   │   │   └── HealthCheck.jsx     # Health status display
│   │   ├── components/
│   │   │   ├── Header.jsx          # Navigation header
│   │   │   └── Footer.jsx          # Footer
│   │   ├── App.jsx                 # Router setup
│   │   ├── main.jsx                # React entry
│   │   └── index.css               # Tailwind directives
│   ├── package.json
│   └── vite.config.js
│
├── README.md                       # This file
└── .env.example                    # Environment variables template
```

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **MongoDB** (local or cloud, e.g., MongoDB Atlas)

### Environment Variables

Create a `.env` file in the `backend/` directory. Use `.env.example` as a template:

```bash
MONGO_URI=mongodb://localhost:27017/tinylink
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

**Environment Variables:**
- `MONGO_URI`: MongoDB connection string (local or Atlas)
- `PORT`: Backend server port (default: 3000)
- `BASE_URL`: Frontend origin for CORS

```


➜  Local:   http://localhost:5173/
```
## API Endpoints

### Create a Short Link

**POST** `/api/links`

**Request Body:**
```json
{
  "targetUrl": "https://example.com/very/long/url",
  "code": "mycode"  // optional; auto-generated if omitted
}
```

**Response (201):**
```json
{
  "_id": "...",
  "code": "mycode",
  "targetUrl": "https://example.com/very/long/url",
  "clicks": 0,
  "last_clickedAt": null,
  "createdAt": "2025-11-20T...",
  "updatedAt": "2025-11-20T..."
}
```

**Error (409):** Code already exists.

### Get All Links

**GET** `/api/links`

**Response (200):**
```json
[
  { "code": "mycode", "targetUrl": "...", "clicks": 5, ... },
  { "code": "docs", "targetUrl": "...", "clicks": 12, ... }
]
```

### Get Link Details

**GET** `/api/links/:code`

**Response (200):**
```json
{
  "code": "mycode",
  "targetUrl": "https://example.com/...",
  "clicks": 5,
  "last_clickedAt": "2025-11-20T10:30:00Z",
  "createdAt": "2025-11-20T10:00:00Z",
  "updatedAt": "2025-11-20T10:30:00Z"
}
```

### Delete a Link

**DELETE** `/api/links/:code`

**Response (200):**
```json
{ "message": "link deleted successfully" }
```

### Redirect to Target URL

**GET** `/:code`

**Behavior:**
- Returns HTTP 302 redirect to the target URL.
- Increments `clicks` counter.
- Updates `last_clickedAt` timestamp.
- Returns 404 if code does not exist or has been deleted.

### Health Check

**GET** `/healthz`

**Response (200):**
```json
{
  "ok": true,
  "version": "1.0"
}
```

## URL Code Format

- **Length**: 6–8 alphanumeric characters
- **Allowed**: A-Z, a-z, 0-9
- **Globally Unique**: Cannot be reused or duplicated
- **Auto-generated**: If omitted, a random 6-character code is generated

## UI Pages & Routes

| Page              | Route        | Purpose                                          |
|-------------------|--------------|--------------------------------------------------|
| Dashboard         | `/`          | List, create, search, and manage short links     |
| Link Stats        | `/code/:code` | View detailed stats for a single link            |
| Health Status     | `/health`    | Display server health and version info          |


### Manual Testing (Postman / cURL)

**1. Create a link:**
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://github.com","code":"gh"}'
```

**2. List all links:**
```bash
curl http://localhost:3000/api/links
```

**3. Get link details:**
```bash
curl http://localhost:3000/api/links/gh
```

**4. Redirect (visit in browser):**
```
http://localhost:3000/gh
```

**5. Delete a link:**
```bash
curl -X DELETE http://localhost:3000/api/links/gh
```

**6. Check health:**
```bash
curl http://localhost:3000/healthz
```

## Deployment
4. Set environment variables:
   - `MONGO_URI=<your-neon-postgres-or-mongodb-atlas-uri>`
   - `PORT=3000`
   - `NODE_ENV=production`

## Environment Variables Reference

**`.env.example`:**
```
MONGO_URI=mongodb://localhost:27017/tinylink
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

## Known Issues & Limitations

- **No authentication**: All links are public; no user accounts.
- **Rate limiting**: Not implemented; consider adding for production.
- **Database backups**: Manual backups recommended for production.
- **URL validation**: Basic URL format validation; may not catch all edge cases.


---

**Live Demo**: [[TINY LINK](https://tintlink-frontend.onrender.com/)]
**GitHub**: [https://github.com/kanishkmishra-afk/TintLink](https://github.com/kanishkmishra-afk/TintLink)
