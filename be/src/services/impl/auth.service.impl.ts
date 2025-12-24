import { IAuthService } from "@services/auth.service";
import { IUser } from "@models/user";
import bcrypt from "bcryptjs";
import { registerRequest } from "@dtos/request/register.request";
import { loginRequest } from "@dtos/request/login.request";
import userModel from "@models/user";
import userToken from "@models/token";
import { Model } from "mongoose";
import ConflictContentException from "@exceptions/conflictContent.exception";
import UnauthorizedException from "@exceptions/unauthorized.exception";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@utils/jwtUtils";
import { IUserToken } from "@models/token";
import { JwtPayload } from "jsonwebtoken";

class AuthServiceImpl implements IAuthService {
  private model: Model<IUser>;
  private modelToken: Model<IUserToken>;

  constructor() {
    this.model = userModel.getModel();
    this.modelToken = userToken.getModel();
  }

  async login(credential: loginRequest): Promise<any> {
    const user = await this.model.findOne({
      email: credential.email,
      status: "active",
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const match = await bcrypt.compare(
      credential.password,
      user.passwordHash || ""
    );
    if (!match) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const access = generateAccessToken(user._id.toString());
    const refresh = generateRefreshToken(user._id.toString());

    await this.modelToken.findOneAndUpdate(
      { userId: user._id as any },
      {
        tokenHash: await bcrypt.hash(refresh, 10),
        expiredAt: new Date(
          (((await verifyRefreshToken(refresh)) as JwtPayload).exp as number) *
            1000
        ),
      } as any,
      { upsert: true, new: true }
    );

    return { access_token: access, refresh_token: refresh };
  }

  async register(credential: registerRequest): Promise<any | string> {
    const existing = await this.model.findOne({ email: credential.email });
    if (existing) {
      throw new ConflictContentException("email already exist");
    }

    const created = await this.model.create({
      fullName: credential.firstName + " " + credential.lastName,
      email: credential.email,
      gender: credential.gender ?? "not_specified",
      role: credential.role ?? "user",
      status: "active",
      passwordHash: await bcrypt.hash(credential.password, 10),
    });

    return created._id.toString();
  }

  async logout(refreshToken: string): Promise<void> {
    await userToken
      .getModel()
      .findOneAndDelete({ tokenHash: refreshToken as string });
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded || decoded?.invalid || decoded?.expired) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    await this.modelToken.findOneAndUpdate(
      { userId: decoded.id as any },
      {
        tokenHash: await bcrypt.hash(newRefreshToken, 10),
        expiredAt: new Date(
          (((await verifyRefreshToken(newRefreshToken)) as JwtPayload)
            .exp as number) * 1000
        ),
      } as any,
      { upsert: true, new: true }
    );

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }
}

export default AuthServiceImpl;
