import prisma from "../prisma/client";
import { status } from "../prisma/seeds/status";
import { branches } from "../prisma/seeds/branches";
import { products } from "../prisma/seeds/products";
import { users } from "../prisma/seeds/users";
import { services } from "../prisma/seeds/services";
import { schedules } from "../prisma/seeds/schedules";
import { reservations } from "../prisma/seeds/reservations";
import { invoiceHeaders } from "../prisma/seeds/invoiceHeaders";
import { invoiceDetails } from "../prisma/seeds/invoiceDetails";
import { categories } from "../prisma/seeds/categories";

const main = async () => {
  try {
    // Status
    await prisma.status.createMany({
      data: status,
    });

    // Branch
    await prisma.branch.createMany({
      data: branches,
    });

    // Category
    await prisma.category.createMany({
      data: categories,
    });

    // Product
    await prisma.product.createMany({
      data: products,
    });

    // User
    await prisma.user.createMany({
      data: users,
    });

    // Service
    await prisma.service.createMany({
      data: services,
    });

    // Schedule
    await prisma.schedule.createMany({
      data: schedules,
    });

    // Reservation
    await prisma.reservation.createMany({
      data: reservations,
    });

    // InvoiceHeader
    await prisma.invoiceHeader.createMany({
      data: invoiceHeaders,
    });

    // InvoiceDetail
    await prisma.invoiceDetail.createMany({
      data: invoiceDetails,
    });

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error occurred while seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((err) => {
  console.warn("An error occurred while executing seeder:\n", err);
});
