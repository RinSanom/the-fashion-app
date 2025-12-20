import { HttpContext } from "../types/httpContext";

export default interface AuthService {
  login(httpContext: HttpContext): Promise<void>;
  register(httpContext: HttpContext): Promise<void>;
  logout(httpContext: HttpContext): Promise<void>;
  continueWithGoogle(httpContext: HttpContext): Promise<void>;
  continueWithFacebook(httpContext: HttpContext): Promise<void>;
}
