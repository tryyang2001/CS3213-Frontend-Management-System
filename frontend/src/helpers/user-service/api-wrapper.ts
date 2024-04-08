import axios from "axios";
import HttpStatusCode from "@/types/HttpStatusCode";

const api = axios.create({
  baseURL:
    process.env.USER_API_ENDPOINT ?? "http://localhost:3001/user",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

const login = async (email: string, password: string): Promise<User> => {
    const response = await api.post(
        `/login`,
        {
            email: email,
            password: password
        },
        { withCredentials: true}
    ).then((res) => {
        if (res.status === HttpStatusCode.OK.valueOf()) {
            const responseData = res.data as LoginResponse;
            const user = responseData.user;
            return user;
        } else {
            console.log("invaliad email/password");
            throw new Error("Invalid Email/Password");
        }
    }).catch((err: Error) => {
        console.log(err);
        throw err;
    });
    return response;
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
            throw new Error("We are currently encountering some issues, please try again later");
        }
    }).catch((err: Error) => {
        throw err;
    });
    return response;
}

const userService = {
    login,
    register,
    getUserInfo
};

export default userService;
