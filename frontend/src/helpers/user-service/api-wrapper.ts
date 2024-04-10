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
            return response.data.user as User;
        } else {
            throw new Error("Unknown error updating password, please try again");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            console.log(error.response?.status);
            if (error.response?.status === HttpStatusCode.UNAUTHORIZED.valueOf()) {
                throw new Error("Unauthorize");
            } else if (error.response?.status === HttpStatusCode.FORBIDDEN.valueOf()) {
                throw new Error("Incorrect password");
            } else {
                throw new Error(error.message);
            }
        }
        throw new Error("Unknown error updating password, please try again");
    };
};

const register = async (email: string, password: string) => {
    await api.post(
        `/register`,
        {
            email: email,
            password: password,
            name: 'name placeholder',
            major: 'major placeholder',
            course: 'course placeholder',
            role: 'student'
        },
    ).then((res) => {
        if (res.status !== HttpStatusCode.OK.valueOf()) {
            throw new Error("We are currently encountering some issues, please try again later");
        }
    }).catch((err: Error) => {
        throw err;
    });
};

const getUserInfo = async (uid: number): Promise<UserInfo | null> => {
    const response = await api.get(
        `/getUserInfo?uid=${uid}`,
        { withCredentials: true}
    ).then((res) => {
        if (res.status === HttpStatusCode.OK.valueOf()) {
            const responseData = res.data as UserInfo
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
    }).catch((_err: Error) => {
        return null;
    });
    return response;
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
            } else {
                throw new Error(error.message);
            }
        }
        throw new Error("Unknown error updating password, please try again");
    };
};

const userService = {
    login,
    register,
    getUserInfo,
    updateUserPassword
};

export default userService;
