import axios, { isAxiosError } from "axios";
import HttpStatusCode from "@/types/HttpStatusCode";

const api = axios.create({
  baseURL: process.env.USER_API_ENDPOINT ?? "http://localhost:3001/user",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

const login = async (email: string, password: string): Promise<User> => {
    try {
        const response = await api.post(
            `/login`,
            {
                email: email,
                password: password
            },
            { withCredentials: true}
        )
        console.log(response.status);
        if (response.status === HttpStatusCode.OK.valueOf()) {
            const user = response.data as User;
            return user;
        } else {
            throw new Error("Unknown error logging in, please try again");
        }
    } catch (error) {
        console.log(error);
        if (isAxiosError(error)) {
            console.log(error.response?.status);
            if (error.response?.status === HttpStatusCode.UNAUTHORIZED.valueOf()) {
                throw new Error("Unauthorize");
            } else if (error.response?.status === HttpStatusCode.FORBIDDEN.valueOf()) {
                throw new Error("Incorrect password");
            } else if (error?.response?.data) {
                const responseData = error.response as ErrorResponse;
                throw new Error(responseData.data.message);
            }
        }
        throw new Error("Unknown error logging in, please try again");
    };
};

const register = async (email: string, password: string) => {
    try {
        await api.post(
            `/register`,
            {
                email: email,
                password: password,
                name: 'name placeholder',
                major: 'major placeholder',
                role: 'student'
            },
        );
    } catch(error) {
        console.log(error);
        if (isAxiosError(error) && error?.response?.data) {
            const responseData = error.response as ErrorResponse;
            throw new Error(responseData.data.message);
        }
        throw new Error("Unknown error signing up, please try again");
    };
};

const getUserInfo = async (uid: number): Promise<UserInfo | null> => {
    try {
        const response = await api.get(
            `/getUserInfo?uid=${uid}`,
            { withCredentials: true}
        )
        if (response.status === HttpStatusCode.OK.valueOf()) {
            const responseData = response.data as UserInfo
            const userInfo : UserInfo = {
                name: responseData.name,
                email: responseData.email,
                bio: responseData.bio || "This person doesn't have bio",
                photo: responseData.photo
            }
            return userInfo;
        } else {
            return null;
        }
    } catch(error)  {
        if (isAxiosError(error)) {
            if (error.response?.status === HttpStatusCode.UNAUTHORIZED.valueOf()) {
                throw new Error("Unauthorize");
            } else if (error?.response?.data) {
                const responseData = error.response as ErrorResponse;
                throw new Error(responseData.data.message);
            }
        }
        throw new Error("Unknown getting user information, please try again");
    }
}

const updateUserPassword = async (uid: number, oldPassword: string, newPassword: string) => {
    try {
        const response = await api.put(
            `/updateUserPassword`,
            {
                uid: uid,
                old_password: oldPassword,
                new_password: newPassword,
            },
            { withCredentials: true}
        );
        if (response.status === HttpStatusCode.OK.valueOf()) {
            return;
        } else {
            return  new Error("Unknown error updating password, please try again");
        }
    } catch (error) {
        console.log(error);
        if (isAxiosError(error)) {
            if (error.response?.status === HttpStatusCode.UNAUTHORIZED.valueOf()) {
                throw new Error("Unauthorize");
            } else if (error.response?.status === HttpStatusCode.FORBIDDEN.valueOf()) {
                throw new Error("Incorrect password");
            } else if (error?.response?.data) {
                const responseData = error.response as ErrorResponse;
                console.log(responseData);
                throw new Error(responseData.data.message);
            }
        }

        throw new Error("Unknown error updating password, please try again");
    };
};

const updateUserInfo = async (
    uid: number,
    updateFields: Record<string, string>
  ): Promise<void> => {
    try {
      const response = await api.put(
        `/updateUserInfo?uid=${uid}`,
        updateFields,
        { withCredentials: true }
      );
  
      if (response.status === HttpStatusCode.OK.valueOf()) {
        return;
      } else {
        throw new Error("Unknown error updating user info, please try again");
      }
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        if (error.response?.status === HttpStatusCode.UNAUTHORIZED.valueOf()) {
          throw new Error("Unauthorized action, please login again");
        } else if (error?.response?.data) {
            const responseData = error.response as ErrorResponse;
            throw new Error(responseData.data.message);
        }
      }
      throw new Error("Unknown error updating user info, please try again");
    }
  };

const userService = {
    login,
    register,
    getUserInfo,
    updateUserPassword,
    updateUserInfo
};

export default userService;
