import cors from "cors";
import { config } from "@/config";

const allowedOrigins = [
  "http://localhost:3000", // Next.js dev
  "http://127.0.0.1:3000" // sometimes needed
];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // allow
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
});

export default corsMiddleware;
