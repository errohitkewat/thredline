# Threadline

A full-stack e-commerce app for a clothing store, built with the MERN stack. Shoppers can browse products and sign up, while sellers get a dashboard to create, edit, publish, unlist and delete products with multi-image upload.

**Live demo:** [threadline-three.vercel.app](https://threadline-three.vercel.app)

> Frontend is hosted on Vercel and the API on Railway. Both are served from the same domain, so the refresh-token cookie works without any CORS setup.

---

## Features

**Authentication**
- Register, login and logout with JWT access tokens
- Short-lived access token kept in memory, long-lived refresh token stored in an `httpOnly` cookie
- Refresh-token rotation: every refresh issues a new token and invalidates the old one
- Session is restored automatically on page reload
- Axios interceptor silently refreshes an expired token and retries the failed request

**Storefront**
- Home page listing all published products
- Product detail page with image gallery, price and size availability

**Seller dashboard** (role-based access)
- List every product, published or not
- Publish / unlist a product with one click
- Add a product with up to 7 images (2 MB each), uploaded to ImageKit
- Edit a product, including adding and removing images
- Delete a product, with a confirmation prompt and image cleanup

**Other**
- Server-side validation with `express-validator`, mirrored by client-side validation
- Route guards on the frontend (`ProtectedRoutes`, `SellerRoutes`, `GuestRoutes`)
- Responsive, minimal black-and-white UI

---

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Redux Toolkit, React Hook Form, Axios, Tailwind CSS 4 |
| Backend | Node.js, Express 5, Mongoose, JSON Web Tokens, bcryptjs, Multer, express-validator |
| Database | MongoDB Atlas |
| Image storage | ImageKit |
| Hosting | Vercel (client), Railway (server) |

---

## Project structure

```
threadline/
├── client/                     # React frontend
│   ├── src/
│   │   ├── app/                # store, router, layouts
│   │   ├── components/         # Navbar and shared UI
│   │   ├── features/
│   │   │   ├── auth/           # api, slice, Login / Register pages
│   │   │   └── products/       # api, components, Home / Detail / Dashboard / Form pages
│   │   ├── lib/                # axios instance, helpers
│   │   └── routes/             # route guards
│   ├── vercel.json             # API proxy + SPA fallback
│   └── vite.config.js
└── server/                     # Express backend
    └── src/
        ├── app/                # express app
        ├── config/             # env config, database connection
        ├── controller/         # auth and product controllers
        ├── middleware/         # authenticate, validateSeller, validation, data parsing
        ├── models/             # User and Product schemas
        ├── routes/             # auth and product routes
        ├── services/           # ImageKit storage service
        ├── validators/         # request validators
        └── server.js           # entry point
```

---

## Getting started

### Prerequisites

- Node.js 22 or newer
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB instance)
- An [ImageKit](https://imagekit.io) account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/errohitkewat/thredline.git
cd thredline
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database-name>
ACCESS_TOKEN_SECRET=<a long random string>
REFRESH_TOKEN_SECRET=<a different long random string>
IMAGE_KIT_PRIVATE_KEY=<your ImageKit private key>
```

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the API:

```bash
npm run dev      # development, with nodemon
npm start        # production
```

The server runs on `http://localhost:3000`. Opening it in a browser should return `{"message":"Server is running"}`.

### 3. Set up the client

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173`. Vite proxies every `/api` request to `http://localhost:3000`, so no extra configuration is needed.

### 4. Create a seller account

Every new user is created with the `user` role, and there is no sign-up option for sellers. To try the seller dashboard:

1. Register a normal account in the app.
2. Open your database (MongoDB Atlas or Compass), find the user in the `users` collection and change `role` from `"user"` to `"seller"`.
3. Log out and log in again so the app picks up the new role.

The **Dashboard** and **Add Product** links will now appear in the navbar.

### Scripts

| Location | Command | Description |
|---|---|---|
| `server` | `npm run dev` | Start the API with nodemon |
| `server` | `npm start` | Start the API with Node |
| `client` | `npm run dev` | Start the Vite dev server |
| `client` | `npm run build` | Create a production build in `dist/` |
| `client` | `npm run preview` | Preview the production build |
| `client` | `npm run lint` | Run ESLint |

---

## API reference

Base URL: `http://localhost:3000/api` (locally) or `/api` on the deployed site.

Protected routes expect the access token in the header:

```
Authorization: Bearer <accessToken>
```

### Health

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Returns `{"message":"Server is running"}` |

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account and log the user in |
| POST | `/api/auth/login` | Public | Log in with email and password |
| GET | `/api/auth/me` | Logged-in user | Get the current user's details |
| POST | `/api/auth/refresh` | Refresh-token cookie | Issue a new access token and rotate the refresh token |
| POST | `/api/auth/logout` | Refresh-token cookie | Invalidate the refresh token and clear the cookie |

**Register** request body:

```json
{
  "name": "Aman Singh",
  "email": "aman@example.com",
  "password": "Test1234",
  "confirmPassword": "Test1234"
}
```

Rules: name 3–50 characters; password at least 6 characters with one uppercase letter and one number; `confirmPassword` must match.

**Login** request body:

```json
{ "email": "aman@example.com", "password": "Test1234" }
```

Both register and login respond with:

```json
{
  "message": "...",
  "data": {
    "user": { "id": "...", "name": "Aman Singh", "email": "aman@example.com", "role": "user" }
  },
  "accessToken": "<jwt>"
}
```

and set the `refreshToken` cookie (`httpOnly`, `sameSite: strict`, `secure` in production).

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all **published** products |
| GET | `/api/products/:id` | Public | Get a single product |
| GET | `/api/products/seller` | Seller | List all products, published or not |
| POST | `/api/products` | Seller | Create a product (multipart form data) |
| PUT | `/api/products/:id` | Seller | Update a product (multipart form data) |
| DELETE | `/api/products/:id` | Seller | Delete a product and its images |
| PATCH | `/api/products/list/:id` | Seller | Publish a product |
| PATCH | `/api/products/unlist/:id` | Seller | Unlist a product |

New products are **unlisted** by default and only appear on the storefront once published.

**Create / update product** uses `multipart/form-data`, because it carries image files. Complex fields are sent as JSON strings:

| Field | Type | Notes |
|---|---|---|
| `title` | string | 10–100 characters |
| `description` | string | 20–500 characters |
| `price` | JSON string | `{"amount": 1499, "currency": "INR"}`. Amount must be at least 0.01, currency is `INR` or `USD` |
| `sizes` | JSON string | `[{"size": "M", "stock": 10}]`. Sizes: `XS`, `S`, `M`, `L`, `XL`, `XXL` |
| `images` | file(s) | Up to 7 images, 2 MB each. Repeat the field for each file |
| `existingImageIds` | JSON string | **Update only.** `["fileId1", "fileId2"]`: the images to keep. Any other saved image is deleted |

Example product response:

```json
{
  "message": "Product fetched successfully",
  "data": {
    "product": {
      "_id": "...",
      "title": "6 Pocket Relaxed Fit Cargo Pants",
      "description": "...",
      "price": { "amount": 999, "currency": "INR" },
      "sizes": [{ "size": "M", "stock": 12 }],
      "images": [{ "url": "https://ik.imagekit.io/...", "fileId": "..." }],
      "published": true
    }
  }
}
```

### Errors

Errors return a JSON body with a `message`. Validation failures also include an `errors` array:

```json
{
  "message": "Invalid request",
  "errors": [{ "msg": "Password must contain an uppercase letter", "path": "password" }]
}
```

| Status | Meaning |
|---|---|
| 400 | Validation error or invalid product ID |
| 401 | Missing, invalid or expired token |
| 403 | Authenticated, but not a seller |
| 404 | Resource not found |
| 409 | Email already registered |
| 500 | Server error |

---

## How authentication works

1. On login or register, the server returns an **access token** in the response body and sets a **refresh token** in an `httpOnly` cookie.
2. The client keeps the access token in Redux (memory only, never in `localStorage`) and sends it with every request through an Axios request interceptor.
3. When the access token expires, the API answers `401`. A response interceptor calls `/api/auth/refresh`, stores the new token and retries the original request. Concurrent requests share a single refresh call.
4. On page reload, the app calls `/api/auth/refresh` and then `/api/auth/me` to restore the session.
5. If the refresh token is missing, expired or reused, the user is logged out.

---

## Deployment

The app is deployed as two services that share one public domain.

**Backend: Railway**
- Root directory: `server`
- Start command: `npm start`
- Environment variables: everything from the `.env` file above, plus `NODE_ENV=production`. Do not set `PORT`, Railway provides it.
- Allow Railway to reach MongoDB Atlas under **Network Access**.

**Frontend: Vercel**
- Root directory: `client`
- Framework preset: Vite
- `client/vercel.json` rewrites `/api/*` to the Railway URL and falls back to `index.html` for client-side routes:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://<your-railway-domain>/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Because the browser only ever talks to the Vercel domain, the `sameSite: strict` refresh cookie works and no CORS configuration is required.

---

## Roadmap

- Shopping cart and checkout
- Product search, filters and pagination
- Order history for customers
- Ownership checks so sellers can only manage their own products
- Seller sign-up flow
- Automated tests

---

## Author

Built by [Rohit Kewat](https://github.com/errohitkewat).