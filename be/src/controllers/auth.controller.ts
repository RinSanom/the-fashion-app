import { HttpContext } from "../types/httpContext";

class AuthController {
  async register(http: HttpContext) {}

  async login(http: HttpContext) {}

  async logout(http: HttpContext) {}
}

export default new AuthController();
