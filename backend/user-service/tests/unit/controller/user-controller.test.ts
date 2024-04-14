import supertest from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/user-model";
import createUnitTestServer from "../../utils/create-test-server-utils";
import { getCreateUserRequestBody } from "../../payload/request/create-user-request-body";
import { getLoginUserRequestBody } from "../../payload/request/login-user-request-body";
import { QueryResult } from "pg";
import { loginUserResponseBody } from "../../payload/response/login-user-response-body";
import { createUserResponseBody } from "../../payload/response/create-user-response-body";
import { getUserResponseBody } from "../../payload/response/get-user-response-body";
import { getUpdateUserPasswordRequestBody } from "../../payload/request/update-user-password-request-body";
import { NextFunction } from "express";
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";
import { User } from "../../../types/user";
import {
  LoginBody,
  RegisterBody,
  UpdatePasswordBody,
} from "../../../types/request-body";

process.env.NODE_ENV = "test";

jest.mock("../../../psql", () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

jest.mock("../../../middleware/auth", () => {
  return jest.fn(async (_req: Request, _res: Response, next: NextFunction) => {
    // Always call next() without performing any authentication checks
    next();
  });
});

describe("health function", () => {
  const app = createUnitTestServer();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "User microservice is working" when the database check is successful', async () => {
    // Arrange
    jest
      .spyOn(db, "checkDatabase")
      .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);

    // Act
    const response = await supertest(app).get("/user/health");

    // Assert
    expect(db.checkDatabase).toHaveBeenCalled();
    expect(response.body).toEqual({ message: "User microservice is working." });
  });

  it('should return 500 status code and "Internal User microservice internal error" message when the database check fails', async () => {
    // Arrange
    jest
      .spyOn(db, "checkDatabase")
      .mockRejectedValue(new Error("Database error"));

    // Act
    const response = await supertest(app).get("/user/health");

    expect(db.checkDatabase).toHaveBeenCalled();
    expect(response.status).toEqual(
      HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()
    );
    expect(response.body).toEqual({
      message: "Internal User microservice internal error.",
    });
  });
});

describe("Unit Tests for /user/register endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: RegisterBody;
  beforeEach(() => {
    reqBody = getCreateUserRequestBody();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a valid request body to register a user", () => {
    it("Should return 201 and the uid", async () => {
      // Arrange

      jest
        .spyOn(db, "getUserByEmail")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);
      jest.spyOn(db, "createNewUser").mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

      // Act
      const response = await supertest(app)
        .post("/user/register")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual(createUserResponseBody);
      // expect(response.status).toBe(201);
    });
  });

  describe("Given an existing email", () => {
    it("Should return 400 and error message", async () => {
      // Arrange
      jest.spyOn(db, "getUserByEmail").mockResolvedValue({
        rows: [{ email: reqBody.email }],
      } as unknown as QueryResult<User>);
      jest.spyOn(db, "createNewUser").mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

      // Act
      const response = await supertest(app)
        .post("/user/register")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Email already exists." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given too short password", () => {
    it("Should return 400 and error message", async () => {
      reqBody.password = "short";

      // Arrange
      jest
        .spyOn(db, "getUserByEmail")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);
      jest.spyOn(db, "createNewUser").mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

      // Act
      const response = await supertest(app)
        .post("/user/register")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Password not long enough." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given failure to create user", () => {
    it("Should return 400 and error message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByEmail")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);
      jest
        .spyOn(db, "createNewUser")
        .mockRejectedValue(new Error("Failed to create user."));
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

      // Act
      const response = await supertest(app)
        .post("/user/register")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Failed to create user." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given failure to encrpyt password", () => {
    it("Should return 400 and message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByEmail")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);
      jest.spyOn(db, "createNewUser").mockResolvedValue(1);
      bcrypt.hash = jest
        .fn()
        .mockRejectedValue(new Error("Error crypting password."));

      // Act
      const response = await supertest(app)
        .post("/user/register")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Error crypting password." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given an undefined error during user registration", () => {
    it("Should return 400 and error message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByEmail")
        .mockRejectedValue(new Error("Database error"));
      jest.spyOn(db, "createNewUser").mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

      // Act
      const response = await supertest(app)
        .post("/user/register")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error creating users.",
      });
      // expect(response.status).toBe(400);
    });
  });
});

describe("Unit Tests for /user/login endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: LoginBody;

  beforeEach(() => {
    reqBody = getLoginUserRequestBody();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a valid request body to login a user", () => {
    it("Should return 200 and a token", async () => {
      // Arrange
      jest.spyOn(db, "getUserByEmail").mockResolvedValue({
        rows: [
          {
            uid: 1,
            email: "test@example.com",
            password: "password12345",
            name: "Test",
            major: "Computer Science",
            role: "student",
          },
        ],
      } as unknown as QueryResult<User>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockResolvedValue("fake_token");
      process.env.JWT_SECRET_KEY = "secretkey";
      // Act
      const response = await supertest(app)
        .post("/user/login")
        .send({ email: "test@example.com", password: "password12345" });
      console.log("Response:", response.body);

      // Assert
      expect(response.body).toEqual(loginUserResponseBody);
      expect(response.status).toBe(200);
    });
  });

  describe("Given a non-existing email", () => {
    it("Should return 400 and an error message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByEmail")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);

      // Act
      const response = await supertest(app).post("/user/login").send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "User does not exist." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given an incorrect password", () => {
    it("Should return 400 and an error message", async () => {
      // Arrange
      reqBody.password = "wrongpassword";
      jest.spyOn(db, "getUserByEmail").mockResolvedValue({
        rows: [{ email: reqBody.email, password: "hashedpassword" }],
      } as unknown as QueryResult<User>);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act
      const response = await supertest(app).post("/user/login").send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Incorrect password." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given JWT secret key is not defined", () => {
    it("Should return a 500 status and an error message", async () => {
      // Mock process.env.JWT_SECRET_KEY to be undefined
      jest.spyOn(db, "getUserByEmail").mockResolvedValue({
        rows: [loginUserResponseBody],
      } as unknown as QueryResult<User>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      delete process.env.JWT_SECRET_KEY;

      // Act
      const response = await supertest(app).post("/user/login").send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error cannot authenticate user logging in",
      });
      // expect(response.status).toBe(500);
    });
  });

  describe("Given an error while checking the password", () => {
    it("Should return 500 and an error message", async () => {
      // Arrange
      jest.spyOn(db, "getUserByEmail").mockResolvedValue({
        rows: [{ email: reqBody.email, password: "hashedpassword" }],
      } as unknown as QueryResult<User>);
      bcrypt.compare = jest
        .fn()
        .mockRejectedValue(new Error("Error checking password."));

      // Act
      const response = await supertest(app).post("/user/login").send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error checking password.",
      });
      // expect(response.status).toBe(500);
    });
  });
});

describe("Unit Tests for /user/getUserInfo endpoint", () => {
  const app = createUnitTestServer();
  let uid: number;
  const existingUserId = 1;
  const nonExistingUserId = -1;
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given invalid not string user ID", () => {
    it("return a bad request response", async () => {
      // Arrange
      const request = {
        query: { uid: {} },
      };

      // Act
      const response = await supertest(app)
        .get(`/user/getUserInfo?`)
        .send(request);

      // Assert
      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST.valueOf());
    });
  });

  describe("Given a valid user ID", () => {
    it("Should return the user object", async () => {
      // Arrange
      uid = existingUserId;
      jest.spyOn(db, "getUserByUserId").mockResolvedValue({
        rows: [getUserResponseBody],
      } as unknown as QueryResult<User>);

      // Act
      const response = await supertest(app).get(`/user/getUserInfo?uid=${uid}`);
      // Assert
      expect(response.body).toEqual(getUserResponseBody);
    });
  });

  describe("Given a non-existing user ID", () => {
    it("Should return an error message", async () => {
      // Arrange
      uid = nonExistingUserId;
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);

      // Act
      const response = await supertest(app).get(`/user/getUserInfo?uid=${uid}`);

      // Assert
      expect(response.body).toEqual({ message: "User does not exist." });
    });
  });

  describe("Given an error while fetching user", () => {
    it("Should return an error message", async () => {
      // Arrange
      uid = existingUserId;
      jest
        .spyOn(db, "getUserByUserId")
        .mockRejectedValue(new Error("Database error"));

      // Act
      const response = await supertest(app).get(`/user/getUserInfo?uid=${uid}`);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error getting user by uid.",
      });
    });
  });
});

describe("Unit Tests for /user/updateUserPassword endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: UpdatePasswordBody;
  const user = {
    uid: 1,
    email: "test@example.com",
    password: "password12345",
    name: "Test",
    major: "Computer Science",
    role: "student",
  };

  beforeEach(() => {
    reqBody = getUpdateUserPasswordRequestBody();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a valid request body to update user password", () => {
    it("Should return a success message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<User>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.hash = jest.fn().mockResolvedValue("newhashedpassword");
      jest.spyOn(db, "updateUserPassword").mockResolvedValue();

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Update password successfully.",
      });
      expect(response.status).toBe(200);
    });
  });

  describe("Given a non-existing user", () => {
    it("Should return an error message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<User>);

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "User does not exist." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given an incorrect old password", () => {
    it("Should return an error message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<User>);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Incorrect password." });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given a failure to update user password", () => {
    it("Should return an error message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<User>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.hash = jest.fn().mockResolvedValue("newhashedpassword");
      jest
        .spyOn(db, "updateUserPassword")
        .mockRejectedValue(new Error("Failed to update user password."));

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error updating user password.",
      });
      // expect(response.status).toBe(500);
    });
  });

  describe("Given an error while encrypting the new password", () => {
    it("Should return a message indicating the error", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<User>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.hash = jest
        .fn()
        .mockRejectedValue(new Error("Error crypting password."));

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error updating user password.",
      });
      // expect(response.status).toBe(500);
    });
  });

  describe("Given an error while checking the password", () => {
    it("Should return a message indicating the error", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<User>);
      bcrypt.compare = jest
        .fn()
        .mockRejectedValue(new Error("Error checking password."));

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error updating user password.",
      });
      // expect(response.status).toBe(500);
    });
  });

  describe("Given an error while getting the user by uid", () => {
    it("Should return a message indicating the error", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockRejectedValue(new Error("Error getting user by uid."));

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error updating user password.",
      });
      // expect(response.status).toBe(500);
    });
  });
});

describe("Unit Tests for /user/updateUserInfo endpoint", () => {
  const app = createUnitTestServer();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a valid request body to update user info", () => {
    it("Should return a success message", async () => {
      // Arrange
      const updateFields = {
        name: "Updated Name",
        major: "Updated Major",
        email: "updated@example.com",
        role: "updatedRole",
      };
      jest.spyOn(db, "updateUserInfo").mockResolvedValue();

      // Act
      const response = await supertest(app)
        .put(`/user/updateUserInfo?uid=${1}`)
        .send(updateFields);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "User information updated." });
    });
  });

  describe("Given an invalid request body to update user info", () => {
    it("Should return an error message saying no update field given valid uid", async () => {
      // Arrange
      const reqBody = {};
      jest
        .spyOn(db, "updateUserInfo")
        .mockRejectedValue(new Error("No fields provided for update."));

      // Act
      const response = await supertest(app)
        .put(`/user/updateUserInfo?uid=${1}`)
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "No fields provided for update.",
      });
      // expect(response.status).toBe(400);
    });

    it("Should return an error message if database is not working", async () => {
      // Arrange
      const reqBody = { email: "abdef@gmail.com" };
      jest
        .spyOn(db, "updateUserInfo")
        .mockRejectedValue(new Error("Database is not working"));

      // Act
      const response = await supertest(app)
        .put(`/user/updateUserInfo?uid=${1}`)
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error updating user info.",
      });
      // expect(response.status).toBe(400);
    });

    it("Should return an error message saying Invalid uid.", async () => {
      // Arrange
      const reqBody = {};
      jest
        .spyOn(db, "updateUserInfo")
        .mockRejectedValue(new Error("Invalid uid."));

      // Act
      const response = await supertest(app)
        .put(`/user/updateUserInfo`)
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Invalid uid." });
      // expect(response.status).toBe(400);
    });
  });
});

describe("Unit Tests for /user/deleteUser endpoint", () => {
  const app = createUnitTestServer();
  const user = {
    uid: 1,
    email: "test@example.com",
    password: "password12345",
    name: "Test",
    major: "Computer Science",
    role: "student",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a valid request body to delete a user", () => {
    it("Should return a 200 status and a success message", async () => {
      // Arrange
      jest
        .spyOn(db, "deleteUser")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<User>);

      // Act
      const response = await supertest(app).delete("/user/deleteUser?uid=1");

      // Assert
      expect(response.body).toEqual({ message: "User deleted successfully." });
    });
  });

  describe("Given an invalid request body to delete a user", () => {
    it("Should return a 400 status and an error message", async () => {
      // Arrange
      jest
        .spyOn(db, "deleteUser")
        .mockRejectedValue(new Error("Failed to delete user."));

      // Act
      const response = await supertest(app).delete("/user/deleteUser");

      // Assert
      expect(response.body).toEqual({
        message: "Invalid uid.",
      });
      // expect(response.status).toBe(400);
    });
  });

  describe("Error on database sied", () => {
    it("Should return a 500 status and an error message", async () => {
      // Arrange
      jest
        .spyOn(db, "deleteUser")
        .mockRejectedValue(new Error("Failed to delete user."));

      // Act
      const response = await supertest(app).delete("/user/deleteUser?uid=1");

      // Assert
      expect(response.body).toEqual({
        message: "Internal server error deleting account.",
      });
      // expect(response.status).toBe(400);
    });
  });
});

describe("Unit Tests for /user/clearCookie endpoint", () => {
  const app = createUnitTestServer();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should clear the "token" cookie and return a success message', async () => {
    // Act
    const response = await supertest(app).delete("/user/clearCookie");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Authentication token cleared successfully",
    });
    expect(response.headers["set-cookie"]).toEqual([
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);
  });
});
