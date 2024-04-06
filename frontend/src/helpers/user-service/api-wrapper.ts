import axios from "axios";
import { UserInfo } from "../../components/common/ReadOnlyUserCard";

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
        if (res.status == 200) {
            console.log(res);
            const user = res.data as User;
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
        { withCredentials: true}
    ).then((res) => {
        console.log(res);
        if (res.status != 200) {
            throw new Error("We are currently encountering some issues, please try again later");
        }
    }).catch((err: Error) => {
        throw err;
    });
};

const getUserInfo = async (uid: BigInteger): Promise<UserInfo | null> => {
    await api.post(
        `/getUserByUserId`,
        {
            uid: uid
        },
        { withCredentials: true}
    ).then((res) => {
        console.log(res);
        if (res.status == 200) {
            const userInfo = res.data as UserInfo;
            return userInfo;
        } else {
            throw new Error("We are currently encountering some issues, please try again later");
        }
    }).catch((err: Error) => {
        throw err;
    });
    return null
}

const userService = {
    login,
    register,
    getUserInfo
};

export default userService;
