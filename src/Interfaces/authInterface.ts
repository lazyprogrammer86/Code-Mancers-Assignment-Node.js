interface RegistrationBody {
    username: string
    email: string
    password: string,
    userId?: string,
    isAdmin?: boolean
};

interface LoginBody {
    email: string
    password: string
};

interface tokenInfo {
    username: string
    email: string
    userId: string
    isAdmin: boolean
};