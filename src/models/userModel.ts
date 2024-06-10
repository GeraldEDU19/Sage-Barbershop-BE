import { Branch } from "./branchModel";
import { InvoiceHeader } from "./invoiceHeaderModel";
import { Reservation } from "./reservationModel";
import { Role } from "./roleModel";
import { Service } from "./serviceModel";

export interface User {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  address: string;
  birthdate: Date;
  password: string;
  role: Role;
  Service?: Service[];
  Branch?: Branch;
  branchId?: number;
  createdAt: Date;
  updatedAt: Date;
  Reservation?: Reservation[];
  Invoice?: InvoiceHeader[];
}
