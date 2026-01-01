import { IUser } from "@models/user";

export interface ProfileService {
  update(user: IUser): Promise<IUser | any>;
  delete(id: string): Promise<void>;
}
