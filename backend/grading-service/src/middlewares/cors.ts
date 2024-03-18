// @ts-expect-error as there is no @types/cors package available for typescript
import cors from "cors";

// TODO: Add production site to allowed origins
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:8088"];

  type CustomOrigin = (
    requestOrigin: string | undefined,
    callback: (err: Error | null, origin?: boolean) => void,
  ) => void;
  
const verifyOrigin : CustomOrigin = (origin, callback) => {
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
  methods: ["GET", "POST", "PUT"],
};

export default cors(corsOptions);
