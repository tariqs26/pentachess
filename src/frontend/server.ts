import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import type { Socket as NetSocket } from "node:net";

interface SocketServer extends HTTPServer {
  io?: Server;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends Response {
  socket: SocketWithIO;
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handler) as SocketServer;
  const io = new Server(server, {
    path: "/api/socketio",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  server.io = io;

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("gameEvent", (event) => {
      // Broadcast the event to all clients in the same game room
      const gameId = socket.handshake.query.gameId;
      if (gameId) {
        socket.to(gameId as string).emit("gameEvent", event);
      }
    });

    socket.on("joinGame", (gameId: string) => {
      socket.join(gameId);
      console.log(`Client joined game: ${gameId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});