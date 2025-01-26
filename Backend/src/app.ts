import express, { Request, Response } from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import religionManagerRouter from './routes/religion.routes';
import castRouter from './routes/cast.routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the actual front-end URL
    credentials: true, // This allows cookies to be sent along with the request
  })
);
app.use(cookieParser());

// routes
app.use("/api/v1/religion", religionManagerRouter);
app.use("/api/v2/cast", castRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Working");
});

export default app;