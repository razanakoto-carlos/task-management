# task-manager

A REST API for Task Management application built with **Node.js**, **Express** and **PRISMA**.

---

## ✨ Features

- 🔐 User registration & authentication (JWT)
- 📦 Task Management

---

## 🛠️ Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Runtime    | Node.js                     |
| Framework  | Express.js                  |
| Database   | PostgreSQL + PRISMA         |
| Auth       | JSON Web Tokens (JWT)       |
| Security   | bcryptjs                    |
| Config     | dotenv                      |

---

📁 Project Structure

```
node-mongo-ecommerce-api/
│── prisma/             # schema postgre and migrations
├── src/
│   ├── controllers/    # Route logic (user, product, cart, order)
│   ├── middlewares/    # Auth middleware, error handler
│   ├── routes/         # Express routers
│   └── server.js       # App entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/razanakoto-carlos/task-management
cd task-management
```

### 2. Install dependencies

```bash
npm install
npx prisma migrate dev
npx prisma generate
```

### 3. Configure environment variables

```bash
create .env
```

Edit `.env` with your values:

```env
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
```

### 4. Start the server

```bash
# Development
npm run dev

```

---

 ## 📡 API Endpoints

### Auth
| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/auth/register`      | Register a new user       |
| POST   | `/auth/login`         | Login a user              |

---
## 🔒 Authentication

Protected routes require a Bearer token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

---