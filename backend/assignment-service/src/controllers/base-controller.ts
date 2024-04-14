import { Request, Response } from "express";
import HttpStatusCode from "../libs/enums/HttpStatusCode";
import db from "../models/db";

const getHealth = async (_: Request, response: Response): Promise<void> => {
  try {
    await db.$queryRaw`SELECT 1`;

    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } catch (_error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "No database connection from the server",
    });
  }
};

export const BaseController = {
  getHealth,
};
