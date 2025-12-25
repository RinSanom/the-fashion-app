import { IMailService } from "@services/mail.service";
import redisUtils from "@utils/redisUtils";
import { generateOtp } from "@utils/randOtpCode";
import { Request, Response } from "express";
import mailServiceImpl from "@services/impl/mail.service.impl";

class OTPController {
  private mailer: IMailService;

  constructor(mailer: IMailService) {
    this.mailer = mailer;
    this.sendVerificationCode = this.sendVerificationCode.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
  }

  async sendVerificationCode(req: Request, res: Response) {
    const { email } = req.body;

    const otp = await generateOtp();

    await redisUtils.saveCodeVerification(otp);
    await this.mailer.sendMailVerificationCode(email, otp);

    res.status(200).send({
      message: "Verification code sent successfully",
      isSuccess: true,
      statusCode: 200,
    });
  }

  async verifyCode(req: Request, res: Response) {
    const { code } = req.body;
    const isValid = await redisUtils.verifyCode(code);

    if (isValid == 0) {
      return res.status(400).send({
        message: "Invalid or expired verification code",
        isSuccess: false,
        isValid: false,
        statusCode: 400,
      });
    }

    res.status(200).send({
      message: "Verification code is valid",
      isSuccess: true,
      isValid: true,
      statusCode: 200,
    });
  }
}

export default new OTPController(mailServiceImpl);
