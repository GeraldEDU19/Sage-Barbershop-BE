import { InvoiceHeader } from "./invoiceHeaderModel";
import { Product } from "./productModel";
import { Service } from "./serviceModel";

export interface InvoiceDetail {
  sequence: number;
  invoiceHeader: InvoiceHeader;
  invoiceHeaderId: number;
  service?: Service;
  serviceId?: number;
  product?: Product;
  productId?: number;
  quantity?: number;
  price: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}
