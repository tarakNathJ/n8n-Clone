import { mockCredentials, mockAuthUser } from './mockData';
import axios from 'axios'

const AUTH_KEY = 'auth_token';
const USER_KEY = 'user_info';
const email = "email"

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  static login(data: LoginData): Promise<AuthUser> {
    return new Promise(async (resolve, reject) => {
      console.log(data)

      try {
        const responce: any = await axios.post(`${import.meta.env.VITE_PRIMARY_BACKEND}/login`, {
          email: data.email,
          password: data.password
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        localStorage.setItem(AUTH_KEY, responce.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(responce.data.payload));
        localStorage.setItem(email ,responce?.data?.payload?.email)
        if (responce.data.success == true) {
          resolve(responce.data.payload);
        } else {
          reject(responce.data)
        }

      } catch (error) {
        reject(error);
      }
    });
  }

  static signup(data: SignupData): Promise<AuthUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const responce: any = await axios.post(`${import.meta.env.VITE_PRIMARY_BACKEND}/SighUp`, {
          name: data.name,
          email: data.email,
          password: data.password
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log(responce);
        localStorage.setItem(AUTH_KEY, responce.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(responce.data.Data));
        if (responce.data.success == true) {
          resolve(responce.data.Data);
        } else {
          reject(responce.data)
        }

      } catch (error) {
        reject(error);
      }

    });
  }

  static logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(AUTH_KEY);

    if (token && userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }

    return null;
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_KEY);
  }
}