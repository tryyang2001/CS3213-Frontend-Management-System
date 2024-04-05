import axios, { AxiosError } from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL:
    process.env.USER_API_ENDPOINT ?? "http://localhost:3001/user",
  timeout: 5000,
  headers: {
    "Content-type": "application/json",
  },
});

interface GetUsersResponse {
  users: User[];
}

const login = async (email: string, password: string) => {
    const response = await api.post(
        `/login`,
        {
            email: email,
            password: password
        },
        { withCredentials: true}
    ).then((res) => {
        if (res.status == 401) {
            throw new Error("Invalid Email/Password");
        } else {
            Cookies.set('user', JSON.stringify(res.data.user), {expires: 7});
            const user = res.data as User;
            return user
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
    const response = await api.post(
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
        throw err
    });
};

const userService = {
    login,
    register
};

export default userService;
