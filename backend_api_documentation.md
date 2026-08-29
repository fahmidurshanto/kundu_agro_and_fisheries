# Backend API Specification & Data Flow Architecture

This document provides a comprehensive analysis of the existing application data flow and details the exact API endpoints required to transition from local JSON file storage to a dedicated Backend API service.

---

## 1. System Architecture & Current Data Flow

Currently, the application operates as a Next.js App Router monolith with server-side JSON persistence (`data/*.json`) and local file storage (`public/uploads/*`).

```
[ Frontend Client ] 
        │
        ▼
[ Next.js Server Actions / App Routes ]
        │
        ├── Authentication: Cookie Session (`SESSION_COOKIE`)
        ├── Local JSON Files: `data/products.json`, `data/blogs.json`, `data/users.json`
        └── File System Storage: `public/uploads/products/`, `public/uploads/blogs/`
```

### Proposed Backend Integration Architecture
```
[ Frontend Client (Next.js) ]
        │
        ├── (HTTP Requests / Form Data)
        ▼
[ Backend REST API Service ]
        │
        ├── Authentication: Bearer Token / JWT / Session Cookie
        ├── Database (PostgreSQL / MongoDB / MySQL)
        └── Media Cloud Storage (AWS S3 / Cloudinary / Storage Bucket)
```

---

## 2. Data Models / Schemas

### A. Auth / Session
- **Admin Authentication**: Email & Password
- **Session Token**: `SESSION_COOKIE` (`kundu_admin_session`)

### B. User Entity (`users`)
| Field | Type | Description |
|---|---|---|
| `id` | `String` (UUID/cuid) | Unique Identifier |
| `name` | `String` | Full Name |
| `email` | `String` | Email address (Unique) |
| `phone` | `String` | Phone number |
| `role` | `Enum` | `"Admin"` \| `"Manager"` \| `"Staff"` \| `"Customer"` |
| `status` | `Enum` | `"Active"` \| `"Inactive"` |
| `createdAt` | `DateTime / ISOString` | Timestamp |

### C. Product Entity (`products`)
| Field | Type | Description |
|---|---|---|
| `id` | `String` (UUID/cuid) | Unique Identifier |
| `name` | `String` | Product Title |
| `slug` | `String` | URL-friendly slug (Unique) |
| `description` | `String` | Detailed text description |
| `category` | `String` | e.g. `"Fish"`, `"Feed"`, `"Fertilizer"` |
| `unit` | `String` | e.g. `"kg"`, `"mon"`, `"piece"`, `"liter"` |
| `price` | `Float / Decimal` | Current selling price |
| `compareAtPrice` | `Float / Decimal (Optional)` | Previous/Original price for discount |
| `thumbnail` | `String (URL)` | Path or URL to thumbnail image |
| `createdAt` | `DateTime / ISOString` | Timestamp |

### D. Blog Entity (`blogs`)
| Field | Type | Description |
|---|---|---|
| `id` | `String` (UUID/cuid) | Unique Identifier |
| `slug` | `String` | URL-friendly slug (Unique) |
| `title` | `String` | Article Title |
| `description` | `String` | Short excerpt / summary |
| `content` | `String` | Main article body |
| `thumbnail` | `String (URL)` | Main article image URL |
| `videoUrl` | `String (URL, Optional)` | YouTube URL or uploaded video path |
| `tags` | `Array<String> (Optional)` | Category tags |
| `createdAt` | `DateTime / ISOString` | Timestamp |

---

## 3. Backend REST API Endpoints Specification

### 🔑 Authentication Endpoints

#### `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@kunduagro.com",
    "password": "secretpassword"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "jwt_or_session_token",
    "user": {
      "id": "usr_123",
      "email": "admin@kunduagro.com",
      "role": "Admin"
    }
  }
  ```

#### `POST /api/auth/logout`
- **Response `200 OK`**: `{ "success": true }`

---

### 📦 Product Management Endpoints

#### `GET /api/products`
- **Query Params**: `?category=Fish&search=carp&page=1&limit=20`
- **Response `200 OK`**:
  ```json
  {
    "data": [
      {
        "id": "prod_1",
        "name": "Rui Fish",
        "slug": "rui-fish",
        "description": "Fresh pond fish",
        "category": "Fish",
        "unit": "kg",
        "price": 350,
        "compareAtPrice": 400,
        "thumbnail": "/uploads/products/rui.jpg",
        "createdAt": "2026-08-24T10:00:00.000Z"
      }
    ],
    "total": 1
  }
  ```

#### `GET /api/products/:idOrSlug`
- **Response `200 OK`**: Product object

#### `POST /api/products` (Protected)
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `name`: string
  - `description`: string
  - `category`: string
  - `unit`: string
  - `price`: number
  - `compareAtPrice`: number (optional)
  - `thumbnail`: File (Image)
- **Response `201 Created`**: Created Product object

#### `PUT /api/products/:id` (Protected)
- **Content-Type**: `multipart/form-data` (Supports updated form fields and optional new thumbnail file)
- **Response `200 OK`**: Updated Product object

#### `DELETE /api/products/:id` (Protected)
- **Response `200 OK`**: `{ "success": true, "deletedId": "prod_1" }`

---

### 📝 Blog Management Endpoints

#### `GET /api/blogs`
- **Query Params**: `?tag=Fish&search=farming`
- **Response `200 OK`**: Array of Blog objects

#### `GET /api/blogs/:idOrSlug`
- **Response `200 OK`**: Single Blog object

#### `POST /api/blogs` (Protected)
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `title`: string
  - `description`: string
  - `content`: string
  - `tags`: comma-separated string or array
  - `thumbnail`: File (Image - JPG, PNG, WebP, AVIF <= 5MB)
  - `videoUrl`: string (YouTube URL, optional)
  - `videoFile`: File (Video - MP4, WebM <= 50MB, optional)
- **Response `201 Created`**: Created Blog object

#### `PUT /api/blogs/:id` (Protected)
- **Content-Type**: `multipart/form-data`
- **Response `200 OK`**: Updated Blog object

#### `DELETE /api/blogs/:id` (Protected)
- **Response `200 OK`**: `{ "success": true, "deletedId": "blog_1" }`

---

### 👥 User Management Endpoints

#### `GET /api/users` (Protected)
- **Response `200 OK`**: Array of User objects

#### `POST /api/users` (Protected)
- **Body**: `{ "name", "email", "phone", "role", "status" }`
- **Response `201 Created`**: Created User object

#### `DELETE /api/users/:id` (Protected)
- **Response `200 OK`**: `{ "success": true, "deletedId": "usr_1" }`

---

### 🐟 Fish Seed Seller Management Endpoints

#### `GET /api/sellers/fish-seed`
- **Query Params**: `?district=Mymensingh&status=Verified&search=Rui`
- **Response `200 OK`**: Array of `FishSeedSeller` objects

#### `POST /api/sellers/fish-seed` (Protected)
- **Body**: `{ "name", "hatcheryName", "phone", "district", "locationDetails", "fishTypes": ["Rui", "Katla"], "capacityPerMonth", "status" }`
- **Response `201 Created`**: Created Seller object

#### `PATCH /api/sellers/fish-seed/:id/status` (Protected)
- **Body**: `{ "status": "Verified" | "Pending" | "Inactive" }`
- **Response `200 OK`**: Updated Seller object

#### `DELETE /api/sellers/fish-seed/:id` (Protected)
- **Response `200 OK`**: `{ "success": true, "deletedId": "seller_101" }`

