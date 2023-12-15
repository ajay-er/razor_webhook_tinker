import express, { Request, Response } from "express";
import morgan from "morgan";
import "express-async-errors";
import cors from "cors";
import { errorHandler } from "./error/error-handler";
import { createServer } from "http";
import { webHookCharged } from "./controller/webhookController";
import SocketManager from "./config/socket";
import { getTotalPayment } from "./controller/paymentController";
import { getAllSubscriptions } from "./controller/subscriptionController";

const app = express();

const httpServer = createServer(app);

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

const io = SocketManager.setupSocketIO(httpServer);

app.get("/", (req: Request, res: Response) => {
  res.json({ tinker: "tinker hub daa!" });
});

app.post("/webhook/subscription/charged",webHookCharged);

app.get('/payment/total',getTotalPayment)

app.get('/subcription/all',getAllSubscriptions)

app.use(errorHandler);

export default httpServer;
