export const getLoginUserRequestBody: () => LoginBody = () => {
  return {
    email: "test@example.com",
    password: "password12345",
  };
};
