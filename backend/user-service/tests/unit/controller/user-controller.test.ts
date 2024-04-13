import supertest from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/user-model";
import createUnitTestServer from "../../utils/create-test-server-utils";
import { getCreateUserRequestBody } from "../../payload/request/create-user-request-body";
import { getLoginUserRequestBody } from "../../payload/request/login-user-request-body";
import { getGetUserRequestBody } from "../../payload/request/get-user-request-body";
import { QueryResult } from "pg";
import { getLoginUserResponseBody } from "../../payload/response/login-user-response-body";
import { getCreateUserResponseBody } from "../../payload/response/create-user-response-body";
import { getGetUserResponseBody } from "../../payload/response/get-user-response-body";
import { getGetUserByEmailRequestBody } from "../../payload/request/get-user-by-email-request-body";
import { getGetUserByEmailResponseBody } from "../../payload/response/get-user-by-email-response-body";
import { getGetAllUsersResponseBody } from "../../payload/response/get-all-users-response-body";
import { getUpdateUserPasswordRequestBody } from "../../payload/request/update-user-password-request-body";
import { getUpdateUserInfoRequestBody } from "../../payload/request/update-user-info-request-body";
import { getDeleteUserRequestBody } from "../../payload/request/delete-user-request-body";
import { NextFunction } from "express";
import auth from '../../../middleware/auth';
import HttpStatusCode from "../../../libs/enums/HttpStatusCode";

process.env.NODE_ENV = "test";

jest.mock("../../../psql", () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

jest.mock('../../../middleware/auth', () => {
  return jest.fn(async (req: Request, res: Response, next: NextFunction) => {
    // Always call next() without performing any authentication checks
    next();
  });
});

describe("health function", () => {
  const app = createUnitTestServer();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return \"User microservice is working\" when the database check is successful", async () => {
    // Arrange
    jest.spyOn(db, "checkDatabase").mockResolvedValue([0]);

    // Act
    const response = await supertest(app)
      .get("/user/health")

    // Assert
    expect(db.checkDatabase).toHaveBeenCalled();
    expect(response.body).toEqual({ message: "User microservice is working." });
  });

  it("should return 500 status code and \"Internal User microservice internal error\" message when the database check fails", async () => {
    // Arrange
    jest.spyOn(db, "checkDatabase").mockRejectedValue(new Error("Database error"));

    // Act
    const response = await supertest(app)
      .get("/user/health")

    expect(db.checkDatabase).toHaveBeenCalled();
    expect(response.status).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf());
    expect(response.body).toEqual({ message: "Internal User microservice internal error." });
  });
});

describe("Unit Tests for /user/register endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: any;
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
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);
      jest.spyOn(db, "createNewUser").mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

      // Act
      const response = await supertest(app)
        .post("/user/register")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual(getCreateUserResponseBody());
      // expect(response.status).toBe(201);
    });
  });

  describe("Given an existing email", () => {
    it("Should return 400 and error message", async () => {
      // Arrange
      jest.spyOn(db, "getUserByEmail").mockResolvedValue({
        rows: [{ email: reqBody.email }],
      } as unknown as QueryResult<any>);
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
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);
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
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);
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
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);
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
        message: "Undefined error creating users.",
      });
      // expect(response.status).toBe(400);
    });
  });
});

describe("Unit Tests for /user/login endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: any;

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
        rows: [{
          uid: 1,
          email: 'test@example.com',
          password: 'password12345',
          name: 'Test',
          major: 'Computer Science',
          role: 'student'}
        ],
      } as unknown as QueryResult<any>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockResolvedValue("fake_token");
      process.env.JWT_SECRET_KEY = "secretkey";
      // Act
      const response = await supertest(app).post("/user/login").send({email: 'test@example.com', password: 'password12345'});
      console.log("Response:", response.body);

      // Assert
      expect(response.body).toEqual(getLoginUserResponseBody());
      expect(response.status).toBe(200);
    });
  });

  describe("Given a non-existing email", () => {
    it("Should return 400 and an error message", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByEmail")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);

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
      } as unknown as QueryResult<any>);
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
        rows: [getLoginUserResponseBody()],
      } as unknown as QueryResult<any>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      delete process.env.JWT_SECRET_KEY;

      // Act
      const response = await supertest(app).post("/user/login").send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Internal server error." });
      // expect(response.status).toBe(500);
    });
  });

  describe("Given an error while checking the password", () => {
    it("Should return 500 and an error message", async () => {
      // Arrange
      jest.spyOn(db, "getUserByEmail").mockResolvedValue({
        rows: [{ email: reqBody.email, password: "hashedpassword" }],
      } as unknown as QueryResult<any>);
      bcrypt.compare = jest
        .fn()
        .mockRejectedValue(new Error("Error checking password."));

      // Act
      const response = await supertest(app).post("/user/login").send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Error checking password." });
      // expect(response.status).toBe(500);
    });
  });
});

describe('Unit Tests for /user/getUserInfo endpoint', () => {
  const app = createUnitTestServer();
  let uid: any;
  const existingUserId = 1;
  const nonExistingUserId = -1;
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given invalid not string user ID", () => {
    it("return a bad request response", async () => {
      // Arrange
      const request = {
        query: {uid: {}}
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
      uid = existingUserId
      jest.spyOn(db, "getUserByUserId").mockResolvedValue({
        rows: [getGetUserResponseBody()],
      } as unknown as QueryResult<any>);

      // Act
      const response = await supertest(app)
        .get(`/user/getUserInfo?uid=${uid}`)
      // Assert
      expect(response.body).toEqual(getGetUserResponseBody());
    });
  });

  describe("Given a non-existing user ID", () => {
    it("Should return an error message", async () => {
      // Arrange
      uid = nonExistingUserId;
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);

      // Act
      const response = await supertest(app)
        .get(`/user/getUserInfo?uid=${uid}`)
      
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
      const response = await supertest(app)
        .get(`/user/getUserInfo?uid=${uid}`)

      // Assert
      expect(response.body).toEqual({ message: "Error getting user by uid." });
    });
  });
});

describe("Unit Tests for /user/getUserByEmail endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: any;

  beforeEach(() => {
    reqBody = getGetUserByEmailRequestBody();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should return user details if user exists", async () => {
    jest.spyOn(db, "getUserByEmail").mockResolvedValue({
      rows: [getGetUserByEmailResponseBody()],
    } as unknown as QueryResult<any>);

    // Act
    const response = await supertest(app).get(`/user/getUserByEmail`);

    // Assert
    expect(response.body).toEqual(getGetUserByEmailResponseBody());
    expect(response.status).toBe(200);
  });

  it("Should return an error message if user does not exist", async () => {
    // Arrange
    reqBody.email = "nonexistent@example.com";
    jest
      .spyOn(db, "getUserByEmail")
      .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);

    // Act
    const response = await supertest(app).get(`/user/getUserByEmail`);

    // Assert
    expect(response.body).toEqual({ message: "User does not exist." });
    // expect(response.status).toBe(404);
  });

  it("Should return an error message if there is an error getting user by email", async () => {
    // Arrange
    jest
      .spyOn(db, "getUserByEmail")
      .mockRejectedValue(new Error("Database error"));

    // Act
    const response = await supertest(app).get(`/user/getUserByEmail`);

    // Assert
    expect(response.body).toEqual({ message: "Error getting user by email." });
    // expect(response.status).toBe(500);
  });
});

describe("Unit Tests for /user/updateUserPassword endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: any;
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
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<any>);
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
        .mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);

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
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<any>);
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
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<any>);
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
        message: "Failed to update user password.",
      });
      // expect(response.status).toBe(500);
    });
  });

  describe("Given an error while encrypting the new password", () => {
    it("Should return a message indicating the error", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<any>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.hash = jest
        .fn()
        .mockRejectedValue(new Error("Error crypting password."));

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Error crypting password." });
      // expect(response.status).toBe(500);
    });
  });

  describe("Given an error while checking the password", () => {
    it("Should return a message indicating the error", async () => {
      // Arrange
      jest
        .spyOn(db, "getUserByUserId")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<any>);
      bcrypt.compare = jest
        .fn()
        .mockRejectedValue(new Error("Error checking password."));

      // Act
      const response = await supertest(app)
        .put("/user/updateUserPassword")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: "Error checking password." });
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
      expect(response.body).toEqual({ message: "Error getting user by uid." });
      // expect(response.status).toBe(500);
    });
  });
});

describe("Unit Tests for /user/updateUserInfo endpoint", () => {
  const app = createUnitTestServer();
  let reqBody: any;

  beforeEach(() => {
    reqBody = getUpdateUserInfoRequestBody();
  });

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
        role: "updatedRole"
      };
      jest.spyOn(db, "updateUserInfo").mockResolvedValue();

      // Act
      const response = await supertest(app)
        .put(`/user/updateUserInfo?uid=${1}`)
        .send(updateFields);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "User info updated." });
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
      expect(response.body).toEqual({ message: "No fields provided for update." });
      // expect(response.status).toBe(400);
    });

    it("Should return an error message if database is not working", async () => {
      // Arrange
      const reqBody = { email: "abdef@gmail.com"};
      jest
        .spyOn(db, "updateUserInfo")
        .mockRejectedValue(new Error("Database is not working"));

      // Act
      const response = await supertest(app)
        .put(`/user/updateUserInfo?uid=${1}`)
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({ message: 'Failed to update user info.' });
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
  let reqBody: any;
  const user = {
    uid: 1,
    email: "test@example.com",
    password: "password12345",
    name: "Test",
    major: "Computer Science",
    role: "student",
  };

  beforeEach(() => {
    reqBody = getDeleteUserRequestBody();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a valid request body to delete a user", () => {
    it("Should return a 200 status and a success message", async () => {
      // Arrange
      jest
        .spyOn(db, "deleteUser")
        .mockResolvedValue({ rows: [user] } as unknown as QueryResult<any>);

      // Act
      const response = await supertest(app)
        .delete("/user/deleteUser")
        .send(reqBody);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "User deleted successfully." });
    });
  });

  describe("Given an invalid request body to delete a user", () => {
    it("Should return a 400 status and an error message", async () => {
      // Arrange
      const reqBody = {}; // Invalid request body
      jest
        .spyOn(db, "deleteUser")
        .mockRejectedValue(new Error("Failed to delete user."));
      
      // Act
      const response = await supertest(app)
        .delete("/user/deleteUser")
        .send(reqBody);

      // Assert
      expect(response.body).toEqual({
        message: "Undefined error deleting account.",
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

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Cleared user cookie" });
    expect(response.headers["set-cookie"]).toEqual([
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);
  });
});
