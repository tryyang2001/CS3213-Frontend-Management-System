import { Request, Response } from "express";
import HttpStatusCode from "../libs/enums/HttpStatusCode";
import db from "../models/db";

const getHealth = async (_: Request, response: Response) => {
  try {
    const result = await db.$queryRaw`SELECT 1`;

    if (!result) {
      throw new Error("No database connection from the server");
    }

    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } catch (error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "No database connection from the server",
    });
  }
};

export const BaseController = {
  getHealth,
};
