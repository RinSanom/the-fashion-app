import { registerRequest } from "@dtos/request/register.request";
import { Request, Response } from "express";
import { IAuthService } from "@services/auth.service";
import authServiceImpl from "@services/impl/auth.service.impl";
import { loginRequest } from "@dtos/request/login.request";

class AuthController {
  private authService: IAuthService;

  constructor() {
    this.authService = new authServiceImpl();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  async register(req: Request, res: Response) {
    const credential: registerRequest = req.body;

    const userId = await this.authService.register(credential);

    res.status(201).send({
      message: "User registered successfully.",
      isSuccess: true,
      statusCode: 201,
      data: {
        userId: userId,
      },
    });
  }

  async login(req: Request, res: Response) {
    const credential: loginRequest = req.body;

    const { access_token, refresh_token } = await this.authService.login(
      credential
    );

    res.status(200).send({
      message: "Login successful.",
      isSuccess: true,
      statusCode: 200,
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    });
  }

  async logout(req: Request, res: Response) {
    await this.authService.logout(req.headers["x-refresh-token"] as string);

    res.status(200).send({
      message: "Logout successful.",
      isSuccess: true,
      statusCode: 200,
      data: null,
    });
  }

  async refreshToken(req: Request, res: Response) {
    const { refresh_token, access_token } = await this.authService.refreshToken(
      req.headers["x-refresh-token"] as string
    );

    res.status(200).send({
      message: "Token refreshed successfully.",
      isSuccess: true,
      statusCode: 200,
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    });
  }

  async continueWithGoogle(req: Request, res: Response) {}

  async continueWithFacebook(req: Request, res: Response) {}
}

export default new AuthController();
