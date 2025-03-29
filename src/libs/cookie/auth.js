'use server'
import { cookies } from "next/headers";

const cookieKey = "user";

export const updateAuthCookie = async (user) => {
    cookies().set({ name: cookieKey, value: JSON.stringify(user) });
};

export const getAuthCookie = async () => {
    const authCookie = cookies().get(cookieKey);
    if (authCookie) {
        return JSON.parse(authCookie.value);
    }
    return undefined;
};
