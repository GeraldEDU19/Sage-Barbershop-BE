import { Decimal } from "@prisma/client/runtime/library";

export const products = [
  {
    name: "Shampoo",
    description: "A high-quality shampoo for daily use.",
    categoryId: 1,
    price: new Decimal(15.99),
    image: "shampoo.jpg",
    quantity: 50,
  },
  {
    name: "Face Wash",
    description: "A gentle face wash suitable for all skin types.",
    categoryId: 2,
    price: new Decimal(12.99),
    image: "face_wash.jpg",
    quantity: 100,
  },
  {
    name: "Beard Oil",
    description: "Keeps your beard soft and healthy.",
    categoryId: 3,
    price: new Decimal(19.99),
    image: "beard_oil.jpg",
    quantity: 30,
  },
  {
    name: "Razor",
    description: "A premium razor for a close shave.",
    categoryId: 4,
    price: new Decimal(29.99),
    image: "razor.jpg",
    quantity: 20,
  },
  {
    name: "Hair Brush",
    description: "A durable hair brush.",
    categoryId: 5,
    price: new Decimal(9.99),
    image: "hair_brush.jpg",
    quantity: 75,
  },
];
