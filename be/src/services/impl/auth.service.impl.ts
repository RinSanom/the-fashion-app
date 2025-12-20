import { HttpContext } from "../../types/httpContext";
import AuthService from "../auth.service";

class AuthServiceImpl implements AuthService {
  constructor() {}
  async login(httpContext: HttpContext): Promise<void> {}
  register(httpContext: HttpContext): Promise<void> {
    throw new Error("Method not implemented.");
  }
  logout(httpContext: HttpContext): Promise<void> {
    throw new Error("Method not implemented.");
  }
  continueWithGoogle(httpContext: HttpContext): Promise<void> {
    throw new Error("Method not implemented.");
  }
  continueWithFacebook(httpContext: HttpContext): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default new AuthServiceImpl();
