import { UpdatePasswordBody } from "../../../types/request-body";

export const getUpdateUserPasswordRequestBody: () => UpdatePasswordBody =
  () => {
    return {
      uid: 1,
      old_password: "password12345",
      new_password: "password54321",
    };
  };
