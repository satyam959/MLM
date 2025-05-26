import nodemailer from 'nodemailer';
import fs from 'fs';


class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'anurag.sonu1989@gmail.com', // Your Gmail address
                pass: 'foxd rnfl pfkt oohy',       // Gmail app password
            },
        });
    }

    async sendReceiptEmail(to, subject, text, pdfPathOrBuffer) {
        const isBuffer = Buffer.isBuffer(pdfPathOrBuffer);

        const attachment = isBuffer
            ? {
                filename: 'Membership_Receipt.pdf',
                content: pdfPathOrBuffer,
              }
            : {
                filename: 'Membership_Receipt.pdf',
                content: fs.createReadStream(pdfPathOrBuffer),
              };

        const mailOptions = {
            from: 'anurag.sonu1989@gmail.com',
            to,
            subject,
            text,
            attachments: [attachment]
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

export default new EmailService();
