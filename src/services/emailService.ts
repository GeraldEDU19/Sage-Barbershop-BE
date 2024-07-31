import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // Reemplaza con tu dirección de Gmail
        pass: process.env.SMTP_PASS, // Reemplaza con tu contraseña de aplicación
      },
    });
  }

  async sendEmailReminder(reservation: any) {
    const { User, service, branch, date } = reservation;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: User.email,
      subject: "Appointment Reminder at SageBarbershop",
      html: `
      <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      .body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      .card {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }
      .card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 6px 6px 0 0;
        text-align: center;
        position: relative;
      }
      .img-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .card-header p {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
      }
      .card-body {
        padding: 20px;
      }
      .card-footer {
        background-color: #f8f9fa;
        border-top: 1px solid #e9ecef;
        padding: 10px;
        text-align: center;
        font-size: 14px;
      }
      .card-footer a {
        color: #007bff;
        text-decoration: none;
      }
      .btn-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        font-size: 16px;
        color: #ffffff;
        background-color: #007bff;
        border: none;
        border-radius: 5px;
        text-align: center;
        text-decoration: none;
      }
      .btn:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="body">
      <div class="card">
        <div class="img-container">
          <img
            src="https://i.imgur.com/L8hYNOW.png"
            width="100px"
            alt="SageBarbershop Logo"
          />
        </div>
        <div class="card-header">
          <p>Appointment Reminder</p>
        </div>

        <div class="card-body">
          <p>Dear ${User.name},</p>
          <p>This is a reminder for your appointment:</p>
          <ul>
            <li>
              <strong>Date:</strong> ${new Date(date).toLocaleDateString()}
            </li>
            <li>
              <strong>Time:</strong> ${new Date(date).toLocaleTimeString()}
            </li>
            <li><strong>Service:</strong> ${service.name}</li>
            <li><strong>Branch:</strong> ${branch.name}</li>
          </ul>
          <p>Please confirm your attendance by clicking the button below:</p>
          <div class="btn-container">
            <a href="https://sage-barbershop.netlify.app" class="btn"
              >Confirm Appointment</a
            >
          </div>
        </div>
        <div class="card-footer">Thank you for choosing SageBarbershop!</div>
      </div>
    </div>
  </body>
</html>
    `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${User.email}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
