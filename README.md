# EXP_SERVER_COLLECTION (E-Commerce Web API)

A high-performance, type-safe e-commerce Web API collection built using the **Bun** runtime, **Express**, and **TypeScript**. This repository serves as a centralized backend server suite supporting multiple storefront configurations (including *FastECommerce* and *ShoeShop*) with a structured, professional architecture.

## 🚀 Features

* **High-Performance Runtime:** Powered by Bun for ultra-fast bundling, execution, and dependency management.
* **Type-Safe Architecture:** Built from the ground up with TypeScript, leveraging rigorous type-safety across endpoints and business logic.
* **Database & ORM:** Integrated with PostgreSQL utilizing **Drizzle ORM** for lightweight, type-safe schema management and migrations.
* **Multi-App Configuration:** Supports isolated database configurations for different client applications (`fasteccomerceapi` and `shoeshopapi`).
* **Secure Authentication:** Robust user authentication and authorization using JSON Web Tokens (JWT).
* **Containerized Environment:** Fully dockerized setup using `Dockerfile` and `docker-compose.yml` for seamless local development and production deployment.
* **API Testing Ready:** Includes an Insomnia environment configuration file for rapid endpoint exploration and testing.

---

## 🛠️ Tech Stack

* **Runtime:** [Bun](https://bun.sh/)
* **Framework:** [Express](https://expressjs.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Authentication:** JWT (JSON Web Tokens)
* **Containerization:** Docker / Docker Compose
* **Linting & Formatting:** ESLint / Prettier

---

## 📂 Project Structure

```text
EXP_SERVER_COLLECTION/
├── drizzle/                      # Database migrations and structural snapshots
├── public/                       # Static public assets
├── src/                          # Application source code
│   ├── controllers/              # Request handlers / Business logic controllers
│   ├── middlewares/              # Authentication, validation, and error middlewares
│   ├── models/                   # Drizzle database schemas
│   ├── routes/                   # Express route definitions
│   └── index.ts                  # Application entry point
├── .dockerignore                 # Patterns excluded from Docker builds
├── .env                          # Local environment variables (git-ignored)
├── .gitignore                    # Patterns excluded from Git tracking
├── .prettierrc                   # Prettier formatting rules configuration
├── bun.lock                      # Bun lockfile for strict dependency locking
├── docker-compose.yml            # Multi-container Docker orchestrator configuration
├── Dockerfile                    # Multi-stage production container build steps
├── drizzle.config.fasteccomerceapi.ts  # Drizzle config for FastECommerce application
├── drizzle.config.shoeshopapi.ts       # Drizzle config for ShoeShop application
├── eslint.config.js              # ESLint modern flat file configuration
├── Insomnia_2025-11-24.yaml      # Insomnia API client collection workspace
├── package.json                  # Lifecycle scripts, metadata, and dependencies
├── README.md                     # Project documentation (this file)
└── tsconfig.json                 # TypeScript compiler configurations

```
## ⚙️ Getting Started

Follow these steps to set up the development environment locally.

### Prerequisites

Ensure you have the following installed on your machine:

* **Bun Runtime:** (v1.0.0 or higher recommended) -> [Install Bun](https://bun.sh)
* **Docker & Docker Compose:** -> [Install Docker Desktop](https://docker.com)
* **Git:** For repository management.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd EXP_SERVER_COLLECTION
   ```

2. **Install project dependencies:**
   This project uses Bun's integrated package manager. Running this command will read `package.json` and lock dependencies cleanly inside `bun.lock`:

   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a local `.env` file in the root directory:

   ```bash
   touch .env
   ```

   Open the `.env` file and define the configuration values required by your application (such as database credentials, ports, and JWT configuration keys):

   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database connection string configuration
   DATABASE_URL=postgresql://username:password@localhost:5404/ecommerce_db
   
   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

## 🗄️ Database Configurations & Migrations

This repository handles schema management for separate applications using localized config instances with Drizzle ORM. Run the respective commands depending on which application database layer you are configuring:

### For Fast E-Commerce API

1. **Generate Schema Migrations:**

   ```bash
   bunx drizzle-kit generate --config=drizzle.config.fasteccomerceapi.ts
   ```

2. **Push/Apply Migrations directly to the Database:**

   ```bash
   bunx drizzle-kit migrate --config=drizzle.config.fasteccomerceapi.ts
   ```

### For Shoe Shop API

1. **Generate Schema Migrations:**

   ```bash
   bunx drizzle-kit generate --config=drizzle.config.shoeshopapi.ts
   ```

2. **Push/Apply Migrations directly to the Database:**

   ```bash
   bunx drizzle-kit migrate --config=drizzle.config.shoeshopapi.ts
   ```

## 🏃 Running the Application

### Local Development Mode

To boot the express server using the high-performance Bun runtime with hot-reloading turned on:

```bash
bun run dev
```

### Multi-Container Deployment via Docker

To boot up the complete isolated environment (including the PostgreSQL instance and backend API services defined in `docker-compose.yml`):

1. **Build and start services:**

   ```bash
   docker-compose up --build
   ```

2. **Run infrastructure detached in background:**

   ```bash
   docker-compose up -d
   ```

3. **Shut down containers and stop network routing:**

   ```bash
   docker-compose down
   ```

## 🧪 API Testing & Workspace

An export of the HTTP collection workspace is bundled inside the root folder for easy API exploration and development testing.

1. Launch your **Insomnia REST Client**.

2. Click **Import**, select **File**, and choose `Insomnia_2025-11-24.yaml` from the root directory.

3. Configure the environment sub-variables inside Insomnia to target your designated development base url (e.g., `http://localhost:5000/api`) to start executing and inspecting auth/ecommerce routes.

## 🧹 Linting and Code Quality

To keep development style clean, uniform, and compliant with the rules structured inside `eslint.config.js` and `.prettierrc`:

1. **Analyze and scan files for errors:**

   ```bash
   bun run lint
   ```

2. **Auto-format source files formatting issues:**

   ```bash
   bun run format
   ```
