import $api from "../utils/http";

export class AuthService {
  static async signup(data: any): Promise<void> {
    return $api.post("auth/signup", data);
  }

  static async login(data: any): Promise<{ access_token?: string }> {
    return $api.post("auth/login", data);
  }

  static async verifyCaptcha(data: any): Promise<{ success: true }> {
    return $api.post("auth/captcha/verify-token", data);
  }

  static async verifyLogin(data: any): Promise<{ access_token: string }> {
    return $api.post("auth/login/verify/token", data);
  }
}
