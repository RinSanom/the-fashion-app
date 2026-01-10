import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.router";
import databaseConfig from "config/database.config";
import errorHandler from "./middlewares/error.middleware";
import routeValidation from "middlewares/resource.middleware";
import redis from "ioredis";
import otpRouter from "routes/otp.router";
import passport from "passport";
import "@lib/auth_passport/facebook";
import "@lib/auth_passport/gmail";
import wishlistRouter from "routes/wishlist.router";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { initWS } from "config/websocket.config";

dotenv.config();

databaseConfig.connectDB().then(() => {
  const app = express();
  const server = initWS(http.createServer(app));

  // mounting express plugin
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // mounting passport
  app.use(passport.initialize());

  const redisClient = new redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  });

  // mounting secure route middleware
  app.use(routeValidation);

  app.get("/", (req, res) => res.send("The Fashion App Backend is running!"));

  // mounting routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1", otpRouter);
  app.use("/api/v1/wishlist", wishlistRouter);

  server.listen(Number(process.env.PORT) || 3000, () =>
    console.log(`Server is running on port ${Number(process.env.PORT) || 3000}`)
  );

  // mounting global error handler
  app.use(errorHandler);
});
