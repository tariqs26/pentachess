import dotenv from "dotenv"
import { GameServer } from "./game-server.js"

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const gameServer = new GameServer()

gameServer.start()

const shutdown = async () => {
  console.info("Shutting down server...")
  await gameServer.stop()
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
