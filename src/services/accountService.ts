import $api from "../utils/http";
import { User } from "../utils/interfaces/user.interface";

export class AccountService {
  static async getUserInfo(): Promise<{ user: User }> {
    return $api.get("account/profile");
  }

  static async verifyPhoneNumber(): Promise<void> {
    return $api.post("account/phone/verify");
  }

  static async validatePhoneVerification(data: {
    token: string;
  }): Promise<void> {
    return $api.post("account/phone/verify/token", data);
  }

  static async setTwoFA(data: { set_2fa: boolean }): Promise<void> {
    return $api.post("account/set/twofa", data);
  }

  static async validateTwoFADeactivation(data: {
    token: string;
  }): Promise<void> {
    return $api.post("account/disable-twofa/verify", data);
  }
}
