interface User {
    uid: number;
    email: string;
    name: string;
    major: string;
    course: string;
    role: string;
}

interface UserInfo {
    uid: number;
    name: string;
    email: string;
    bio: string;
    photo?: string;
}

interface LoginResponse {
    user: User;
}