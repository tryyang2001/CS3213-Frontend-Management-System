interface RegisterBody {
  name: string;
  email: string;
  major: string;
  password: string;
  role: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface UpdatePasswordBody {
  uid: number;
  old_password: string;
  new_password: string;
}

interface UpdateFields {
  name?: string;
  email?: string;
  major?: string;
  avatarUrl?: string;
  bio?: string;
  role?: string;
}
