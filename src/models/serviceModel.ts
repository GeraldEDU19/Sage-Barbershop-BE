import { InvoiceDetail } from "./invoiceDetailModel";
import { Reservation } from "./reservationModel";
import { User } from "./userModel";

export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
  image?: string;
  employee: User;
  userId: number;
  Reservation: Reservation[];
  InvoiceDetail: InvoiceDetail[];
  createdAt: Date;
  updatedAt: Date;
}
