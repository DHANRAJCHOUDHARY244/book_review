
**Postman Collection**
> [Collection](https://red-shadow-153481.postman.co/workspace/soms~40b5dae1-978a-4dec-b41f-db0be38cd524/collection/24970769-e9d22d3f-e501-46ed-bb36-1211146bbcd4?action=share&creator=24970769&active-environment=24970769-3546dc52-97e7-461d-a006-f2cf058a4e84)


# 📚 Book Review API

A secure, scalable, and feature-rich **REST API** built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**. Designed for handling **book data**, **user authentication**, and **reviews**, with full support for JWT auth, AWS media uploads, and versioned routing.

---

## 📁 Folder Structure

```bash
src/
├── app.ts
├── config/         # @config
├── constants/      # @constants
├── controllers/    # @controllers
├── data/           # @data
├── interfaces/     # @interfaces
├── middleware/     # @middleware
├── models/         # @models
├── routes/         # @routes
├── services/       # @services
├── template/       # @template
├── utils/          # @utils
```

### ✅ `tsconfig.json` Path Aliases

```json
"paths": {
  "@controllers/*": ["src/controllers/*"],
  "@template/*": ["src/template/*"],
  "@routes/*": ["src/routes/*"],
  "@models/*": ["src/models/*"],
  "@utils/*": ["src/utils/*"],
  "@services/*": ["src/services/*"],
  "@constants/*": ["src/constants/*"],
  "@interfaces/*": ["src/interfaces/*"],
  "@config/*": ["src/config/*"],
  "@data/*": ["src/data/*"],
  "@middleware/*": ["src/middleware/*"]
}
```

> Be sure to load with `tsconfig-paths/register`.

---

## 🛠️ Environment Variables (`.env`)

> **Never expose sensitive credentials in public repositories.** This `.env` is for reference only.

```env
# MongoDB Config
MONGO_URI=mongodb://localhost:27017/book_review

# App Config
PORT=3000
ENV='PRODUCTION'
JWT_SECRET=your_super_secure_secret_key

# AWS S3 (optional for profile image upload)
AWS_MAIN_KEY=
AWS_MAIN_SECRET=
AWS_REGION=us-east-1
AWS_BUCKET_NAME=uniquedj

# Email service (Optional)
IS_EMAIL_SERVICE=false
EMAIL_PASSWORD=
EMAIL_USERNAME=
EMAIL_HOSTNAME=
```

---

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/DHANRAJCHOUDHARY244/book_review.git
cd book_review
```

2. **Install dependencies**

```bash
npm install
```

3. **Create your `.env` file**

Copy the template above into `.env` at the project root and fill in your configuration.

4. **(Optional) Setup MongoDB**

Ensure MongoDB is running locally or update `MONGO_URI` to point to your MongoDB server.

---

## 🛠️ Product Setup

* **Build the TypeScript project**

```bash
npm run build
```

* **Run the app**

For development (with hot reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

* **Cluster Mode with PM2** (for production with zero-downtime restarts):

```bash
npm run cluster-mode
```

---

## 🐳 Docker Setup

Build and run your app with Docker for a consistent production environment:

```dockerfile
# ---------- Stage 1: Build the application ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Stage 2: Run the application ----------
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY .env .env

EXPOSE 3000

CMD ["node", "dist/app.js"]
```

### Build & Run

```bash
docker build -t book-review-api .
docker run -p 3000:3000 --env-file .env book-review-api
```

---

## 🔐 Authentication Strategy

* **JWT-based** auth (`token:<token>`)
* Middleware-protected routes under `/v1/*`
* Email verification & password reset OTPs supported

---

## 🧭 Route Structure

### 🆓 Public Routes

| Method | Endpoint                           | Description                   |
| ------ | ---------------------------------- | ----------------------------- |
| POST   | `/auth/register`                   | Register a new user           |
| POST   | `/auth/login`                      | Login and receive a JWT token |
| POST   | `/auth/verify-email`               | Verify email with OTP         |
| POST   | `/auth/verify-forgot-password-otp` | Verify forgot password OTP    |
| GET    | `/books`                           | Get list of books             |
| GET    | `/books/search`                    | Search books by title/author  |
| GET    | `/books/:id`                       | Get book by ID with reviews   |
| GET    | `/reviews/:id`                     | Get reviews for a book        |

---

### 🔐 Protected Routes (`/v1/*` — Requires Token)

#### 📘 Books

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| POST   | `/books/v1/add`        | Add new book         |
| PUT    | `/books/v1/:id`        | Update book details  |
| DELETE | `/books/v1/:id`        | Delete book          |
| POST   | `/books/v1/:id/review` | Add review to a book |

#### 📝 Reviews

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| PUT    | `/reviews/v1/:id` | Update a review |
| DELETE | `/reviews/v1/:id` | Delete a review |

#### 👤 User

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| POST   | `/users/v1/reset-password`    | Reset password (after OTP)  |
| POST   | `/users/update-user`          | Update profile details      |
| POST   | `/users/update-profile-image` | Upload/update profile image |
| DELETE | `/users/delete`               | Delete own account          |

---

## 📦 Installation & Setup Recap

```bash
git clone https://github.com/DHANRAJCHOUDHARY244/book_review.git
cd book_review
npm install
# Create .env file
npm run dev  # for development
```

---

## 🧼 Code Quality

* **Pino** for structured logs
* **ESLint** + **Prettier** for formatting
* **Path Aliases** for clean imports
* **PM2** for zero-downtime restarts

---

## 📬 Postman Collection

> [Collection](https://red-shadow-153481.postman.co/workspace/soms~40b5dae1-978a-4dec-b41f-db0be38cd524/collection/24970769-e9d22d3f-e501-46ed-bb36-1211146bbcd4?action=share&creator=24970769&active-environment=24970769-3546dc52-97e7-461d-a006-f2cf058a4e84)

---

## 📜 License

**ISC License**
© 2025 [Dhanraj Choudhary](https://dev-dhanraj.vercel.app/)
## ER Diagram

The database schema is visualized in the ER Diagram below:

![ER Diagram](https://raw.githubusercontent.com/DHANRAJCHOUDHARY244/book_review/main/erdb.png)
---

