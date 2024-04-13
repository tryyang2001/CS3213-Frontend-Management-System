import { QueryResult } from "pg";
import pool from "../../../psql";
import model from "../../../models/user-model";

process.env.NODE_ENV = "test";

jest.mock("../../../psql", () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

describe("checkDatabase function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all users", async () => {
    // Arrange
    const mockResult = {
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
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.checkDatabase();

    // Assert
    expect(result).toEqual(mockResult.rows);
  });

  it("should throw an error if query fails", async () => {
    // Arrange
    const errorMessage = "Failed to fetch users";
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.checkDatabase()).rejects.toThrow(errorMessage);
  });
});

describe("getUserByUserId function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user by userId", async () => {
    // Arrange
    const uid = 1;
    const mockResult = {
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
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.getUserByUserId(uid);

    // Assert
    expect(result).toEqual(mockResult);
  });

  it("should throw an error if query fails", async () => {
    // Arrange
    const uid = 1;
    const errorMessage = "Failed to fetch user";
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.getUserByUserId(uid)).rejects.toThrow(errorMessage);
  });
});

describe("getUserByEmail function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user by email", async () => {
    // Arrange
    const email = "test@example.com";
    const mockResult = {
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
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.getUserByEmail(email);

    // Assert
    expect(result).toEqual(mockResult);
  });

  it("should throw an error if query fails", async () => {
    // Arrange
    const email = "test@example.com";
    const errorMessage = "Failed to fetch user";
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.getUserByEmail(email)).rejects.toThrow(errorMessage);
  });
});

describe('findUser function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user if found in the database', async () => {
    const uid = 123;
    const email = 'test@example.com';
    const expectedResult: QueryResult = {
      rows: [{ uid: 123, email: 'test@example.com' }],
      rowCount: 1,
      command: '',
      oid: 0,
      fields: [],
    };

    (pool.query as jest.Mock).mockResolvedValueOnce(expectedResult);

    const result = await model.findUser(uid, email);

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM users."User" WHERE uid = $1 AND email = $2',
      [uid, email]
    );
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error if the database query fails', async () => {
    const uid = 123;
    const email = 'test@example.com';
    const errorMessage = 'Database error';
    
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(model.findUser(uid, email)).rejects.toThrow(errorMessage);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM users."User" WHERE uid = $1 AND email = $2',
      [uid, email]
    );
  });
});

describe("createNewUser function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user and return the user ID", async () => {
    // Arrange
    const name = "New User";
    const major = "Computer Science";
    const email = "newuser@example.com";
    const hash = "newHash";
    const role = "student";

    const mockResult = {
      rows: [{ uid: 1 }],
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.createNewUser(
      name,
      major,
      email,
      hash,
      role
    );

    // Assert
    expect(result).toBe(1);
  });

  it("should throw an error if query fails", async () => {
    // Arrange
    const name = "New User";
    const major = "Computer Science";
    const email = "newuser@example.com";
    const hash = "newHash";
    const role = "student";
    const errorMessage = "Failed to create user";
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(
      model.createNewUser(name, major, email, hash, role)
    ).rejects.toThrow(errorMessage);
  });
});

describe("updateUserPassword function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a user's password", async () => {
    // Arrange
    const uid = 1;
    const hash = "newHash";

    const mockResult = {
      rowCount: 1,
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.updateUserPassword(uid, hash);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should throw an error if query fails", async () => {
    // Arrange
    const uid = 1;
    const hash = "newHash";
    const errorMessage = "Failed to update password";
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.updateUserPassword(uid, hash)).rejects.toThrow(
      errorMessage
    );
  });
});

describe("updateUserInfo function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update user information", async () => {
    // Arrange
    const uid = 1;
    const updateFields = {
      name: "Updated Name",
      major: "Updated Major",
      email: "updated@example.com",
      role: "updatedRole"
    };

    const mockResult = {
      rowCount: 1,
    };
    (pool.query as jest.Mock).mockResolvedValue(mockResult as QueryResult);

    // Act
    const result = await model.updateUserInfo(
      uid,
      updateFields
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should throw an error if update fails", async () => {
    // Arrange
    const uid = 1;
    const updateFields = {
      name: "Updated Name",
      major: "Updated Major",
      email: "updated@example.com",
      role: "updatedRole"
    };
    const errorMessage = "Failed to update user";
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(
      model.updateUserInfo(uid, updateFields)
    ).rejects.toThrow(errorMessage);
  });
});

describe("deleteUser function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a user", async () => {
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

  it("should throw an error if query fails", async () => {
    // Arrange
    const uid = 1;
    const errorMessage = "Failed to delete user";
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Act and Assert
    await expect(model.deleteUser(uid)).rejects.toThrow(errorMessage);
  });
});
