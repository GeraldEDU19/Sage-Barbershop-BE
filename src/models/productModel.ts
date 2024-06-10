import { InvoiceDetail } from "./invoiceDetailModel";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  InvoiceDetail: InvoiceDetail[];
}
