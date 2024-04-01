export const getGetAllUsersResponseBody = () => {
    return [
        { 
          uid: 1,
          email: 'test@example.com',
          password: 'password12345',
          name: 'Test',
          major: 'Computer Science',
          course: 'CS1101S',
          role: 'student',
         },
          {         
            uid: 2,
            email: 'test2@example.com',
            password: 'password12345',
            name: 'Test2',
            major: 'Computer Science',
            course: 'CS1101S',
            role: 'student', 
          }
        ];
  };