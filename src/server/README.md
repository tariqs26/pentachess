# Pentachess Server

## Getting Started

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

5. **Run tests**

   Run the test suite to ensure everything is working correctly:
   ```bash
   npm run test
   ```

   Run tests and generate a coverage report to see how much of your code is covered by tests:

   ```bash
   npm run test:coverage
   ```

   Run tests in watch mode, which automatically reruns tests when files change:

   ```bash
   npm run test:watch
   ```

**Available Scripts**

| Command                 | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `npm run dev`           | Run the server in development mode (http://localhost:8080) |
| `npm run build`         | Build the server for production                            |
| `npm start`             | Run the server in production mode                          |
| `npm run format`        | Format the code using Prettier                             |
| `npm run test`          | Run tests                                                  |
| `npm run test:coverage` | Run tests with coverage report                             |
| `npm run test:watch`    | Run tests in watch mode                                    |