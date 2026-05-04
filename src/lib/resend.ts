import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceDropEmail(email: string, productTitle: string, oldPrice: number, newPrice: number, url: string) {
  try {
    await resend.emails.send({
      from: 'Lesspriz <alerts@lesspriz.com>',
      to: email,
      subject: `Price Drop Alert: ${productTitle}`,
      html: `
        <h1>Good news!</h1>
        <p>The price of <strong>${productTitle}</strong> has dropped from $${oldPrice} to <strong>$${newPrice}</strong>.</p>
        <p><a href="${url}">View Product on Store</a></p>
        <p>Sent via Lesspriz</p>
      `
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
