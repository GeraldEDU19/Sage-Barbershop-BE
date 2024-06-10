import { Branch } from "./branchModel";
import { Service } from "./serviceModel";
import { Status } from "./statusModel";
import { User } from "./userModel";

export interface Reservation {
  id: number;
  date: Date;
  status: Status;
  statusId: number;
  branch: Branch;
  branchId: number;
  service?: Service;
  serviceId?: number;
  User?: User;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}
