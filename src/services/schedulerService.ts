import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './emailService';

const prisma = new PrismaClient();

export class SchedulerService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
    this.scheduleTasks();
  }

  private async sendReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
          lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        User: true,
        service: true,
        branch: true,
      },
    });

    reservations.forEach(async (reservation) => {
      await this.emailService.sendEmailReminder(reservation);
    });
  }

  private scheduleTasks() {
    // Programar la tarea para que se ejecute todos los días a la medianoche
    cron.schedule('*/10 * * * * *', () => {
      console.log('Running scheduled task: sending reminders...');
      this.sendReminders().catch(console.error);
    });

    console.log('Scheduler initialized: tasks will run daily at midnight');
  }
}
