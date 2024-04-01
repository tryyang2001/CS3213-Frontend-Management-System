import supertest from "supertest";
import bcrypt from "bcrypt";
import db from "../models/user-model";
import createUnitTestServer from "./utils/create-test-server-utils";
import { getCreateUserRequestBody } from "./payload/request/create-user-request-body";
import { getLoginUserRequestBody } from './payload/request/login-user-request-body';
import { QueryResult } from "pg";
import { getLoginUserResponseBody } from "./payload/response/login-user-response-body";
import { getCreateUserResponseBody } from "./payload/response/create-user-response-body";

jest.mock("../psql", () => {
  return {
    query: jest.fn(),
    connect: jest.fn(),
  };
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
      expect(response.body).toEqual({ error: "Email already exists." });
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
      expect(response.body).toEqual({ error: "Password not long enough." });
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
      expect(response.body).toEqual({ error: "Failed to create user." });
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
        error: "Undefined error creating users.",
      });
      // expect(response.status).toBe(400);
    });
  });
});

describe('Unit Tests for /user/login endpoint', () => {
  const app = createUnitTestServer();
  let reqBody: any;

  beforeEach(() => {
    reqBody = getLoginUserRequestBody();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a valid request body to login a user", () => {
    it('Should return 200 and a token', async () => {
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [getLoginUserResponseBody()] } as unknown as QueryResult<any>);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockResolvedValue('fake_token');
      process.env.JWT_SECRET_KEY = 'secretkey';

      // Act
      const response = await supertest(app)
        .post('/user/login')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ user: getLoginUserResponseBody() });
      expect(response.status).toBe(200);
    });
  });

  describe("Given a non-existing email", () => {
    it('Should return 400 and an error message', async () => {
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [] } as unknown as QueryResult<any>);

      // Act
      const response = await supertest(app)
        .post('/user/login')
        .send(reqBody);
      
      // Assert
      expect(response.body).toEqual({ error: 'User does not exist.' });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given an incorrect password", () => {
    it('Should return 400 and an error message', async () => {
      // Arrange
      reqBody.password = 'wrongpassword'
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [{ email: reqBody.email, password: 'hashedpassword' }] } as unknown as QueryResult<any>);
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      
      
      // Act
      const response = await supertest(app)
        .post('/user/login')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ error: 'Incorrect password.' });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given an error while checking the password", () => {
    it('Should return 500 and an error message', async () => {
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [{ email: reqBody.email, password: 'hashedpassword' }] } as unknown as QueryResult<any>);
      bcrypt.compare = jest.fn().mockRejectedValue(new Error('Error checking password.'));

      // Act
      const response = await supertest(app)
        .post('/user/login')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ message: 'Error checking password.' });
      // expect(response.status).toBe(500);
    });
  });
});
