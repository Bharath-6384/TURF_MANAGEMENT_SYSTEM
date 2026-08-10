import cors from "cors";

const allowedOrigins = [
  "http://localhost",
  "http://localhost:3000"
];

export default cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else callback(new Error("Not allowed by CORS"));
  },
  credentials: true
});
