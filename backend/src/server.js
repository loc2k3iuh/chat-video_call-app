import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import * as Sentry from "@sentry/node";
import { serve } from "inngest/express";
import { connectDB } from "./config/db.js";
import chatRoutes  from "./routes/chat.route.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";


const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.get("/debug-sentry", (req, res) => {
  throw new Error("My First Sentry Error !");
})

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);

console.log("Mongo Uri: ", ENV.MONGO_URI);

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("Server Started On Port: ", ENV.PORT);
      });
    }
  } catch (error) {
    console.log("Error Starting Server: ", error);
    process.exit(1);
  }
};

startServer();

export default app;
