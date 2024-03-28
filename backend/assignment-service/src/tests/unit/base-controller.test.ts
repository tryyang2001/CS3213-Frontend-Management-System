import supertest from "supertest";
import db from "../../models/db";
import createUnitTestServer from "../utils/create-test-server-utils";
import HttpStatusCode from "../../libs/enums/HttpStatusCode";

const app = createUnitTestServer();
const API_PREFIX = "/assignment/api";

describe("Unit Tests for Base Controller", () => {
  const dbMock = db as jest.Mocked<typeof db>;
  describe("Unit Test for getHealth", () => {
    describe("Given the database is up and running", () => {
      it("should return 200", async () => {
        // Arrange
        dbMock.$queryRaw = jest.fn().mockResolvedValue({
          column: 1,
        });

        // Act
        const response = await supertest(app).get(`${API_PREFIX}/health`);

        // Assert
        expect(response.status).toBe(HttpStatusCode.OK);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          message: "Healthy",
        });
      });
    });

    describe("Given the database is down", () => {
      it("should return 500 with an error message", async () => {
        // Arrange
        dbMock.$queryRaw = jest
          .fn()
          .mockRejectedValue(new Error("Database is down"));

        // Act
        const response = await supertest(app).get(`${API_PREFIX}/health`);

        // Assert
        expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
        expect(Object.keys(response.body).length).toBe(2);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toHaveProperty("message");
        expect(response.body).toEqual({
          error: "INTERNAL SERVER ERROR",
          message: "No database connection from the server",
        });
      });
    });
  });
});
