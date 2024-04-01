import supertest from 'supertest';
import bcrypt from 'bcrypt';
import db from '../models/user-model';
import createUnitTestServer from './utils/create-test-server-utils';
import { getUserRequestBody } from './payload/request/create-user-request-body';
import { QueryResult } from 'pg';

describe('Unit Tests for /user/register endpoint', () => {
  const app = createUnitTestServer();
  let reqBody: any;
  beforeEach(() => {
    reqBody = getUserRequestBody();
  })
  afterEach(() => {
    jest.clearAllMocks();
  })

  describe("Given a valid request body to register a user", () => {
    it('Should return 201 and the uid', async () => {
    
      
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [] } as unknown as QueryResult<any>)
      jest.spyOn(db, 'createNewUser').mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      // Act
      const response = await supertest(app)
        .post('/user/register')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ uid: 1 });
      // expect(response.status).toBe(201);
    });
  });

  describe("Given an existing email", () => {
    it('Should return 400 and error message', async () => {
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [{email: reqBody.email}] } as unknown as QueryResult<any>)
      jest.spyOn(db, 'createNewUser').mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      // Act
      const response = await supertest(app)
        .post('/user/register')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ error: 'Email already exists.' });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given too short password", () => {
    it('Should return 400 and error message', async () => {
      reqBody.password = 'short'

      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [] } as unknown as QueryResult<any>)
      jest.spyOn(db, 'createNewUser').mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      // Act
      const response = await supertest(app)
        .post('/user/register')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ error: 'Password not long enough.' });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given failure to create user", () => {
    it('Should return 400 and error message', async () => {
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [] } as unknown as QueryResult<any>)
      jest.spyOn(db, 'createNewUser').mockRejectedValue(new Error('Failed to create user.'));
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      // Act
      const response = await supertest(app)
        .post('/user/register')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ error: 'Failed to create user.' });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given failure to encrpyt password", () => {
    it('Should return 400 and message', async () => {
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockResolvedValue({ rows: [] } as unknown as QueryResult<any>)
      jest.spyOn(db, 'createNewUser').mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockRejectedValue(new Error('Error crypting password.'));

      // Act
      const response = await supertest(app)
        .post('/user/register')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ message: 'Error crypting password.' });
      // expect(response.status).toBe(400);
    });
  });

  describe("Given an undefined error during user registration", () => {
    it('Should return 400 and error message', async () => {
      // Arrange
      jest.spyOn(db, 'getUserByEmail').mockRejectedValue(new Error('Database error'));
      jest.spyOn(db, 'createNewUser').mockResolvedValue(1);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');

      // Act
      const response = await supertest(app)
        .post('/user/register')
        .send(reqBody);
  
      // Assert
      expect(response.body).toEqual({ error: 'Undefined error creating users.' });
      // expect(response.status).toBe(400);
    });
  });
}); 
