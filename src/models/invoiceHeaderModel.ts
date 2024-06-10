import { Branch } from "./branchModel";
import { InvoiceDetail } from "./invoiceDetailModel";
import { User } from "./userModel";

export interface InvoiceHeader {
    id: number;
    date: Date;
    branch: Branch;
    branchId: number;
    User: User;
    userId: number;
    tax: number;
    total: number;
    InvoiceDetail: InvoiceDetail[];
    createdAt: Date;
    updatedAt: Date;
  }