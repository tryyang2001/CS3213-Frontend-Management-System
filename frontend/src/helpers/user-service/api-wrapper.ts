import { UseUserContext } from "@/contexts/user-context";
import axios from "axios";
import Cookies from 'js-cookie';
import { UserInfo } from "../../components/common/ReadOnlyUserCard";

const api = axios.create({
  baseURL:
    process.env.USER_API_ENDPOINT ?? "http://localhost:3001/user",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

const login = async (email: string, password: string) => {
    const { setUser } = UseUserContext();

    await api.post(
        `/login`,
        {
            email: email,
            password: password
        },
        { withCredentials: true}
    ).then((res) => {
        if (res.status == 200) {
            const user = res.data as User;
            setUser(user);
            Cookies.set('user', JSON.stringify(user), {expires: 7});
            return user;
        } else {
            throw new Error("Invalid Email/Password");
        }
    }).catch((err: Error) => {
        console.log(err);
        return {
            ok: false,
            status: 500
        }
    });
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
            role: 'role placeholder'
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
