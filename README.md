# Pentachess

**Group members:** Brandon Bosman, Karl Sader, Saad Tariq, Mian Rafay, and Emaan Khan

**Project timeline:** September 2024 - April 2025

**Directory structure:**

- `docs`: contains submitted documentation for the project.
- `meetings`: contains notes from our weekly meetings, as well as our meetings with stakeholders.
- `src`: contains the source code for the project. It is split up between `frontend` and `server`.

## Setup Instructions

### Setup Server

1. **Prerequisites**

   - Ensure you have [Node.js](https://nodejs.org/en/download/) (20.18.0 or higher) installed on your machine.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```bash
   CORS_ORIGIN=http://localhost:3000 # Frontend URL
   PORT=8080 # [Optional] Port number for the server
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Run tests**

   ```bash
   npm run test
   ```

### Setup Frontend

1. **Prerequisites**

   - Ensure you have [Node.js](https://nodejs.org/en/download/) (20.18.0 or higher) installed on your machine.
   - For setting up the database locally, you will need [Docker](https://www.docker.com/products/docker-desktop) installed.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```bash
   # MongoDB connection string
   DATABASE_URL="mongodb://localhost:27017/pentachess?replicaSet=rs0"

   # Better Auth
   BETTER_AUTH_SECRET="DdyrIXdEu1XKE3c9TYk9fpWynBm0Qg1y"
   BETTER_AUTH_URL="http://localhost:3000" # Base URL of your app

   # Socket.io
   NEXT_PUBLIC_SOCKET_URL="https://localhost:8080" # URL of the Socket.io server
   ```

4. **Setup Local MongoDB instance (optional)**

   If you don't have a MongoDB instance running, you can start a local instance using Docker Compose:

   ```bash
   npm run compose:dev:up
   ```

5. **Sync database schema**

   ```bash
   npm run db:push
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Run tests**

   ```bash
   npm run test
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
