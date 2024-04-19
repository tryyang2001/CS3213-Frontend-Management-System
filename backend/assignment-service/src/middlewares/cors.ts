import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

type CustomOrigin = (
  requestOrigin: string | undefined,
  callback: (err: Error | null, origin?: boolean) => void
) => void;

const verifyOrigin: CustomOrigin = (origin, callback) => {
  //  when the call is made from the same origin
  if (!origin) {
    return callback(null, true);
  }
  // when the call is made from a different but authorized origin
  else if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  } else {
    return callback(new Error("Not allowed by CORS"), false);
  }
};

const corsOptions = {
  // credentials: true, // We need to allow this when we have the authentication functionality
  origin: verifyOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

export default cors(corsOptions);
