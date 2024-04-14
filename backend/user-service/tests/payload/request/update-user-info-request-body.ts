import { UpdateFields } from "../../../types/request-body";

export const getUpdateUserInfoRequestBody: () => UpdateFields = () => {
  return {
    email: "test@example.com",
    name: "Test",
    major: "Computer Science",
    role: "student",
    bio: "",
    avatarUrl: "",
  };
};
