import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../libs/utils/swaggerUtils";

const router = express.Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const docsRouter = router;

export default docsRouter;
