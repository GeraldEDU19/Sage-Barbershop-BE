import { Reservation } from "./reservationModel";

export interface Status {
  id: number;
  description: string;
  color: string;
  Reservation: Reservation[];
  createdAt: Date;
  updatedAt: Date;
}
