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
   PORT=8080 # [Optional] Port number for the server
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

**Available Scripts**

| Command          | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `npm run dev`    | Run the app in development mode (http://localhost:8080) |
| `npm run build`  | Build the app for production                            |
| `npm start`      | Run the app in production mode                          |
| `npm run format` | Format the code using Prettier                          |
