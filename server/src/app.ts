import helmet from "helmet";
import dotenv = require("dotenv");
import cors = require("cors");
import express = require("express");
import userRoutes from "./routes/user.routes.ts";
import sessionRoutes from "./routes/session.routes.ts";
import authRoutes from "./routes/auth.routes.ts";
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;
const app = express();

/* Only accept requests coming from that browser origin */
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/session', sessionRoutes);

app.listen(PORT, () => {
    console.log(`Started Manabi backend at: http://localhost:${PORT}`);
});
