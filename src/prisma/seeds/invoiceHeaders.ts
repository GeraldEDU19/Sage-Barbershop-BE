import { Decimal } from "@prisma/client/runtime/library";

export const invoiceHeaders = [
  {
    date: new Date("2024-06-01"),
    branchId: 1,
    userId: 1,
    tax: new Decimal(1.5),
    total: new Decimal(16.5),
    status: false,
  },
  {
    date: new Date("2024-06-02"),
    branchId: 2,
    userId: 2,
    tax: new Decimal(1.0),
    total: new Decimal(11.0),
    status: false,
  },
  {
    date: new Date("2024-06-03"),
    branchId: 3,
    userId: 3,
    tax: new Decimal(1.2),
    total: new Decimal(13.2),
    status: false,
  },
  {
    date: new Date("2024-06-04"),
    branchId: 4,
    userId: 4,
    tax: new Decimal(5.0),
    total: new Decimal(55.0),
    status: false,
  },
  {
    date: new Date("2024-06-05"),
    branchId: 5,
    userId: 5,
    tax: new Decimal(2.5),
    total: new Decimal(27.5),
    status: false,
  },
];
