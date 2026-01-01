import userModel, { IUser } from "@models/user";
import { ProfileService } from "@services/profile.service";
import { Model } from "mongoose";

class ProfileServiceImpl implements ProfileService {
  private model: Model<IUser>;

  constructor() {
    this.model = userModel.getModel();
  }

  async update(user: IUser): Promise<IUser | any> {
    return this.model.findByIdAndUpdate(
      {
        _id: user._id,
      },
      user
    );
  }

  async delete(id: string): Promise<void> {
    this.model.findOneAndUpdate({ _id: id }, { deleted: true });
  }
}

export default ProfileServiceImpl;
