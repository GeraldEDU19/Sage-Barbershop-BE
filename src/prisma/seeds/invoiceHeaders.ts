import { Decimal } from "@prisma/client/runtime/library";

export const invoiceHeaders = [
  {
    date: new Date("2024-06-01"),
    branchId: 1,
    userId: 1,
    total: new Decimal(111.99),
    status: true,
  },
  {
    date: new Date("2024-06-02"),
    branchId: 2,
    userId: 2,
    total: new Decimal(240.97),
    status: false,
  },
  {
    date: new Date("2024-06-03"),
    branchId: 3,
    userId: 3,
    total: new Decimal(99.98),
    status: false,
  },
  {
    date: new Date("2024-06-04"),
    branchId: 4,
    userId: 4,
    total: new Decimal(124.98),
    status: true,
  },
  {
    date: new Date("2024-06-05"),
    branchId: 5,
    userId: 5,
    total: new Decimal(114.98),
    status: false,
  },
];
