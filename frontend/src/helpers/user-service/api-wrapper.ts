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
            console.log(res.data.user);
            const user = res.data.user as User;
            console.log(user);
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
        console.log(res);
        if (res.status !== HttpStatusCode.OK.valueOf()) {
            throw new Error("We are currently encountering some issues, please try again later");
        }
    }).catch((err: Error) => {
        throw err;
    });
};

const getUserInfo = async (uid: number): Promise<UserInfo | null> => {
    console.log("this is the uid");
    console.log(uid);
    const response = await api.get(
        `/getUserInfo?uid=${uid}`,
        { withCredentials: true}
    ).then((res) => {
        if (res.status === HttpStatusCode.OK.valueOf()) {
            const userInfo : UserInfo = {
                name: res.data.name,
                email: res.data.email,
                bio: res.data.bio || "This person doesn't have bio",
                photo: res.data.photo
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
