import { QueryResult } from 'pg';
import pool from '../../../psql';
import model from '../../../models/user-model';

jest.mock('../../../psql', () => ({
  query: jest.fn(),
}));

describe('getAllUsers function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users', async () => {
    // Arrange
    const mockResult = {
      rows: [
        {
          uid: 1,
          email: 'test@example.com',
          password: 'password12345',
          name: 'Test',
          major: 'Computer Science',
          course: 'CS1101S',
          role: 'student',
        },
      ],
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.getAllUsers();

    // Assert
    expect(result).toEqual(mockResult.rows);
  });

  it('should throw an error if query fails', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch users';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.getAllUsers()).rejects.toThrow(errorMessage);
  });
});

describe('getUserByUserId function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user by userId', async () => {
    // Arrange
    const uid = 1;
    const mockResult = {
      rows: [
        {
          uid: 1,
          email: 'test@example.com',
          password: 'password12345',
          name: 'Test',
          major: 'Computer Science',
          course: 'CS1101S',
          role: 'student',
        },
      ],
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.getUserByUserId(uid);

    // Assert
    expect(result).toEqual(mockResult);
  });

  it('should throw an error if query fails', async () => {
    // Arrange
    const uid = 1;
    const errorMessage = 'Failed to fetch user';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.getUserByUserId(uid)).rejects.toThrow(errorMessage);
  });
});

describe('getUserByEmail function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user by email', async () => {
    // Arrange
    const email = 'test@example.com';
    const mockResult = {
      rows: [
        {
          uid: 1,
          email: 'test@example.com',
          password: 'password12345',
          name: 'Test',
          major: 'Computer Science',
          course: 'CS1101S',
          role: 'student',
        },
      ],
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.getUserByEmail(email);

    // Assert
    expect(result).toEqual(mockResult);
  });

  it('should throw an error if query fails', async () => {
    // Arrange
    const email = 'test@example.com';
    const errorMessage = 'Failed to fetch user';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.getUserByEmail(email)).rejects.toThrow(errorMessage);
  });
});

describe('updateUser function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should update a user', async () => {
    // Arrange
    const uid = 1;
    const name = 'Updated Name';
    const major = 'Updated Major';
    const course = 'Updated Course';
    const email = 'updated@example.com';
    const hash = 'updatedHash';
    const role = 'updatedRole';

    const mockResult = {
      rowCount: 1,
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);
    // Act
    const result = await model.updateUser(uid, name, major, course, email, hash, role);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should throw an error if query fails', async () => {
    // Arrange
    const uid = 1;
    const name = 'Updated Name';
    const major = 'Updated Major';
    const course = 'Updated Course';
    const email = 'updated@example.com';
    const hash = 'updatedHash';
    const role = 'updatedRole';
    const errorMessage = 'Failed to update user';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.updateUser(uid, name, major, course, email, hash, role)).rejects.toThrow(errorMessage);
  });
});

describe('createNewUser function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and return the user ID', async () => {
    // Arrange
    const name = 'New User';
    const major = 'Computer Science';
    const course = 'CS1101S';
    const email = 'newuser@example.com';
    const hash = 'newHash';
    const role = 'student';

    const mockResult = {
      rows: [{ uid: 1 }],
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.createNewUser(name, major, course, email, hash, role);

    // Assert
    expect(result).toBe(1);
  });

  it('should throw an error if query fails', async () => {
    // Arrange
    const name = 'New User';
    const major = 'Computer Science';
    const course = 'CS1101S';
    const email = 'newuser@example.com';
    const hash = 'newHash';
    const role = 'student';
    const errorMessage = 'Failed to create user';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.createNewUser(name, major, course, email, hash, role)).rejects.toThrow(errorMessage);
  });
});

describe('updateUserPassword function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a user\'s password', async () => {
    // Arrange
    const uid = 1;
    const hash = 'newHash';

    const mockResult = {
      rowCount: 1,
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.updateUserPassword(uid, hash);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should throw an error if query fails', async () => {
    // Arrange
    const uid = 1;
    const hash = 'newHash';
    const errorMessage = 'Failed to update password';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.updateUserPassword(uid, hash)).rejects.toThrow(errorMessage);
  });
});

describe('updateUserInfo function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user information', async () => {
    // Arrange
    const uid = 1;
    const email = 'updated@example.com';
    const name = 'Updated Name';
    const major = 'Updated Major';
    const course = 'Updated Course';
    const role = 'Updated Role';

    const mockResult = {
      rowCount: 1,
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.updateUserInfo(uid, email, name, major, course, role);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should throw an error if update fails', async () => {
    // Arrange
    const uid = 1;
    const email = 'updated@example.com';
    const name = 'Updated Name';
    const major = 'Updated Major';
    const course = 'Updated Course';
    const role = 'Updated Role';
    const errorMessage = 'Failed to update user';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.updateUserInfo(uid, email, name, major, course, role)).rejects.toThrow(errorMessage);
  });
});


describe('deleteUser function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user', async () => {
    // Arrange
    const uid = 1;

    const mockResult = {
      rowCount: 1,
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.deleteUser(uid);

    // Assert
    expect(result).toEqual(mockResult);
  });

  it('should throw an error if query fails', async () => {
    // Arrange
    const uid = 1;
    const errorMessage = 'Failed to delete user';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.deleteUser(uid)).rejects.toThrow(errorMessage);
  });
});
