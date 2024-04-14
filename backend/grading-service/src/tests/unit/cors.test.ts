import supertest from "supertest";
import createUnitTestServer from "../utils/create-test-server-utils";
import HttpStatusCode from "../../libs/enums/HttpStatusCode";
import { Router } from "express";

const app = createUnitTestServer();
const API_PREFIX = "/grading/api";

const routerMock = Router();
routerMock.get("/someEndpoint", (_req, res) => {
  res.status(HttpStatusCode.OK).json({ message: "Pass" });
});

app.use(API_PREFIX, routerMock);

describe("Unit Tests for CORS", () => {
  describe("Given a request from the same origin", () => {
    it("should allow the request to pass through", async () => {
      // Act
      const response = await supertest(app).get(`${API_PREFIX}/someEndpoint`);

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toEqual({
        message: "Pass",
      });
      expect(response.headers).not.toHaveProperty(
        "access-control-allow-origin"
      );
    });
  });

  describe("Given a request from the allowed origin", () => {
    it("should allow the request to pass through", async () => {
      // Arrange
      const origin = "http://localhost:3000";

      // Act
      const response = await supertest(app)
        .get(`${API_PREFIX}/someEndpoint`)
        .set("Origin", origin);

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toEqual({
        message: "Pass",
      });
      expect(response.headers).toHaveProperty("access-control-allow-origin");
      expect(response.headers["access-control-allow-origin"]).toBe(origin);
    });
  });

  describe("Given a request not from an allowed origin", () => {
    it("should block the request", async () => {
      // Arrange
      const origin = "https://some-malicious-website.com";

      // Act
      const apiCall = await supertest(app)
        .get(`${API_PREFIX}/someEndpoint`)
        .set("Origin", origin);

      // Assert
      expect(apiCall.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(apiCall.text).toContain("Not allowed by CORS");
    });
  });
});
