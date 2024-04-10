import axios from "axios";
import HttpStatusCode from "@/types/HttpStatusCode";

const api = axios.create({
  baseURL: process.env.USER_API_ENDPOINT ?? "http://localhost:3001/user",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

const login = async (email: string, password: string): Promise<User> => {
  const response = await api
    .post(
      `/login`,
      {
        email: email,
        password: password,
      },
      { withCredentials: true }
    )
    .then((res) => {
      if (res.status === HttpStatusCode.OK.valueOf()) {
        // the response from login is {user: user: {}}, hence we need to destructure this way
        const user = (res.data as LoginResponse).user;
        return user;
      } else {
        throw new Error("Invalid Email/Password");
      }
    });

  return response;
};

const register = async (email: string, password: string) => {
  await api
    .post(
      `/register`,
      {
        email: email,
        password: password,
        name: "name placeholder",
        major: "major placeholder",
        course: "course placeholder",
        role: "student",
      },
      { withCredentials: true }
    )
    .then((res) => {
      if (res.status !== HttpStatusCode.OK.valueOf()) {
        throw new Error(
          "We are currently encountering some issues, please try again later"
        );
      }
    });
};

const getUserInfo = async (uid: number): Promise<UserInfo | null> => {
  await api
    .post(
      `/getUserInfo`,
      {
        uid: uid,
      },
      { withCredentials: true }
    )
    .then((res) => {
      if (res.status === HttpStatusCode.OK.valueOf()) {
        const userInfo = res.data as UserInfo;
        return userInfo;
      } else {
        throw new Error(
          "We are currently encountering some issues, please try again later"
        );
      }
    });

  return null;
};

const userService = {
  login,
  register,
  getUserInfo,
};

export default userService;
