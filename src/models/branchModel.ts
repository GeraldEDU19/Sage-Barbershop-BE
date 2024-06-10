import { InvoiceHeader } from "./invoiceHeaderModel";
import { Reservation } from "./reservationModel";
import { Schedule } from "./scheduleModel";
import { User } from "./userModel";

export interface Branch {
  id: number;
  name: string;
  description: string;
  phone: string;
  address: string;
  email: string;
  employee: User[];
  Schedule: Schedule[];
  Reservation: Reservation[];
  Invoice: InvoiceHeader[];
  createdAt: Date;
  updatedAt: Date;
}