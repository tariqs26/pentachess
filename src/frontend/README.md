# Pentachess Frontend

## Getting Started

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
   SERVER_URL="https://localhost:8080" # URL of the Socket.io server
   ```

4. **Setup Local MongoDB instance (optional)**

   If you don't have a MongoDB instance running, you can start a local instance using Docker Compose:

   ```bash
   npm run compose:dev:up
   ```

   To stop the local MongoDB instance, run:

   ```bash
   npm run compose:dev:down
   ```

5. **Sync database schema**

   ```bash
   npm run db:push
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

**Available Scripts**

| Command                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `npm run dev`              | Run the app in development mode (http://localhost:3000) |
| `npm run build`            | Build the app for production                            |
| `npm start`                | Run the app in production mode                          |
| `npm run format`           | Format the code using Prettier                          |
| `npm run lint`             | Lint the code using ESLint                              |
| `npm run db:generate`      | Generate the Prisma client                              |
| `npm run db:push`          | Push Prisma schema to the database                      |
| `npm run db:studio`        | Open Prisma Studio                                      |
| `npm run compose:dev:up`   | Startup local MongoDB instance with Docker Compose      |
| `npm run compose:dev:down` | Shutdown local MongoDB instance with Docker Compose     |
