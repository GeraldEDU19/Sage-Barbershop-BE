import { Branch } from "./branchModel";

export interface Schedule {
  id: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  branch: Branch;
  branchId: number;
  createdAt: Date;
  updatedAt: Date;
}
