import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';

interface BrevoEmailPayload {
  sender: { email: string; name: string };
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  attachment?: {
    content: string;
    name: string;
    contentType: string;
  };
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private cachedLogo: string | null = null;
  private cachedLogoAttached: Buffer | null = null;

  constructor(private configService: ConfigService) {
    this.loadLogo();
  }

  private getBrevoApiKey(): string {
    const apiKey = this.configService.get('EMAIL_PASSWORD');
    if (!apiKey) {
      throw new Error('EMAIL_PASSWORD (Brevo API key) is not configured');
    }
    return apiKey;
  }

  private getBrevoSender(): { email: string; name: string } {
    const fromEmail = this.configService.get('EMAIL_FROM') || 'harithashreeit2001@gmail.com';
    const name = fromEmail.split('@')[0].replace(/\./g, ' ');
    return { email: fromEmail, name };
  }

  private async sendBrevoEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
    attachment: { filename: string; content: Buffer; contentType: string } | null = null,
  ): Promise<void> {
    const apiKey = this.getBrevoApiKey();
    const sender = this.getBrevoSender();

    const payload: BrevoEmailPayload = {
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    };

    if (attachment) {
      payload.attachment = {
        content: attachment.content.toString('base64'),
        name: attachment.filename,
        contentType: attachment.contentType,
      };
    }

    try {
      this.logger.log(`📧 Sending email via Brevo HTTP API to ${to}...`);

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`❌ Brevo API error ${response.status}: ${errorText}`);
        return;
      }

      const result = await response.json();
      this.logger.log(`✅ Email sent successfully to ${to}. MessageId: ${result.messageId}`);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
    }
  }

  /**
   * Load logo and cache both base64 and buffer versions
   */
  private loadLogo(): { base64: string | null; buffer: Buffer | null } {
    try {
      if (this.cachedLogo && this.cachedLogoAttached) {
        return { base64: this.cachedLogo, buffer: this.cachedLogoAttached };
      }

      const filePath = join(process.cwd(), 'assets', 'wonnet.png');

      if (!fs.existsSync(filePath)) {
        this.logger.warn(`⚠️ Logo not found at: ${filePath}`);
        return { base64: null, buffer: null };
      }

      const fileBuffer = fs.readFileSync(filePath);
      const fileSizeKB = (fileBuffer.length / 1024).toFixed(2);

      this.logger.log(`📁 Logo loaded: ${filePath}`);
      this.logger.log(`📊 Size: ${fileSizeKB} KB`);

      this.cachedLogoAttached = fileBuffer;
      this.cachedLogo = `data:image/png;base64,${fileBuffer.toString('base64')}`;

      return { base64: this.cachedLogo, buffer: this.cachedLogoAttached };
    } catch (error) {
      this.logger.error('Failed to load logo:', error);
      return { base64: null, buffer: null };
    }
  }

  private getLogoHtml(): string {
    const { base64 } = this.loadLogo();

    if (base64) {
      return `
        <div style="text-align:center;padding:20px 0 10px 0;">
          <div style="display:flex;align-items:center;justify-content:center;gap:12px;">
            <img
              src="${base64}"
              alt="WonNet"
              width="40"
              height="40"
              style="display:inline-block;border:0;border-radius:8px;"
            />
            <div style="text-align:left;">
              <h1 style="font-size:24px;font-weight:700;color:#1a202c;margin:0;line-height:1.2;">
                Won<span style="color:#fbbf24;">Net!</span>
              </h1>
              <p style="font-size:12px;color:#718096;margin:2px 0 0 0;">Smart Job & Talent Network</p>
            </div>
          </div>
        </div>
      `;
    } else {
      return this.getFallbackLogoHtml();
    }
  }

  private getFallbackLogoHtml(): string {
    return `
      <div style="text-align:center;padding:20px 0 10px 0;">
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;">
          <div style="width:40px;height:40px;background:#1a202c;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fbbf24;font-weight:800;font-size:20px;">W</div>
          <div style="text-align:left;">
            <h1 style="font-size:24px;font-weight:700;color:#1a202c;margin:0;line-height:1.2;">
              Won<span style="color:#fbbf24;">Net!</span>
            </h1>
            <p style="font-size:12px;color:#718096;margin:2px 0 0 0;">Smart Job & Talent Network</p>
          </div>
        </div>
      </div>
    `;
  }

  private getLogoAttachment(): { filename: string; content: Buffer; contentType: string } | null {
    const { buffer } = this.loadLogo();

    if (buffer) {
      return {
        filename: 'wonnet-logo.png',
        content: buffer,
        contentType: 'image/png',
      };
    }
    return null;
  }

  private getCommonStyles(): string {
    return `
      body {
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 580px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 30px;
      }
      .content p {
        font-size: 15px;
        margin-bottom: 16px;
        color: #444444;
      }
      .greeting {
        font-size: 18px;
        font-weight: 600;
        color: #222222;
        margin-bottom: 16px;
      }
      .footer {
        border-top: 1px solid #e5e5e5;
        padding-top: 20px;
        margin-top: 30px;
        font-size: 12px;
        color: #888888;
        text-align: center;
      }
      .footer a {
        color: #fbbf24;
        text-decoration: none;
      }
      .divider {
        height: 1px;
        background: #e5e5e5;
        margin: 20px 0;
      }
    `;
  }

  private getFooterHtml(year: number): string {
    return `
      <div class="footer">
        <p>&copy; ${year} WonNet. All rights reserved.</p>
        <p style="margin-top:4px;font-size:11px;color:#999999;">
          You received this email because you registered on WonNet.
        </p>
      </div>
    `;
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  async sendWelcomeEmail(to: string, userName: string) {
    try {
      const logoHtml = this.getLogoHtml();
      const attachment = this.getLogoAttachment();
      const subject = `Welcome to WonNet`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${this.getCommonStyles()}</style>
          </head>
          <body>
            <div class="container">
              ${logoHtml}
              <div class="content">
                <p class="greeting">Hello ${userName},</p>
                <p>Welcome to WonNet.</p>
                <p>Your account is ready. You can now explore opportunities and connect with employers.</p>
                <p>Complete your profile to get started.</p>
                <div class="divider"></div>
                <p style="color:#666666;font-size:14px;">Best regards,<br>The WonNet Team</p>
              </div>
              ${this.getFooterHtml(new Date().getFullYear())}
            </div>
          </body>
        </html>
      `;

      await this.sendBrevoEmail(to, subject, html, this.htmlToText(html), attachment || undefined);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send welcome email: ${error.message}`);
    }
  }

  async sendShortlistedEmail(
    to: string,
    userName: string,
    jobTitle: string,
    companyName: string,
  ) {
    try {
      const logoHtml = this.getLogoHtml();
      const attachment = this.getLogoAttachment();
      const subject = `Application Update - ${jobTitle}`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${this.getCommonStyles()}</style>
          </head>
          <body>
            <div class="container">
              ${logoHtml}
              <div class="content">
                <p class="greeting">Dear ${userName},</p>
                <p>Thank you for applying to ${jobTitle} at ${companyName}.</p>
                <p>Your application has been shortlisted for the next round.</p>
                <p>Our team will contact you with further details.</p>
                <div class="divider"></div>
                <p style="color:#666666;font-size:14px;">Best regards,<br>${companyName} Team</p>
              </div>
              ${this.getFooterHtml(new Date().getFullYear())}
            </div>
          </body>
        </html>
      `;

      await this.sendBrevoEmail(to, subject, html, this.htmlToText(html), attachment || undefined);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send shortlisted email: ${error.message}`);
    }
  }

  async sendInterviewEmail(
    to: string,
    userName: string,
    jobTitle: string,
    companyName: string,
    interviewData: { date: string; time: string; mode: string; linkOrAddress: string },
  ) {
    try {
      const logoHtml = this.getLogoHtml();
      const attachment = this.getLogoAttachment();
      const subject = `Interview Invitation - ${jobTitle}`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${this.getCommonStyles()}</style>
          </head>
          <body>
            <div class="container">
              ${logoHtml}
              <div class="content">
                <p class="greeting">Dear ${userName},</p>
                <p>We would like to invite you for an interview for ${jobTitle} at ${companyName}.</p>
                <div style="background:#f8f9fa;padding:16px;border-radius:6px;margin:16px 0;">
                  <p style="margin:4px 0;"><strong>Date:</strong> ${interviewData.date}</p>
                  <p style="margin:4px 0;"><strong>Time:</strong> ${interviewData.time}</p>
                  <p style="margin:4px 0;"><strong>Mode:</strong> ${interviewData.mode}</p>
                  <p style="margin:4px 0;"><strong>${interviewData.mode.toLowerCase() === 'online' ? 'Link' : 'Location'}:</strong> ${interviewData.linkOrAddress}</p>
                </div>
                <p>Please confirm your availability.</p>
                <div class="divider"></div>
                <p style="color:#666666;font-size:14px;">Best regards,<br>${companyName} Team</p>
              </div>
              ${this.getFooterHtml(new Date().getFullYear())}
            </div>
          </body>
        </html>
      `;

      await this.sendBrevoEmail(to, subject, html, this.htmlToText(html), attachment || undefined);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send interview email: ${error.message}`);
    }
  }

  async sendSelectedEmail(
    to: string,
    userName: string,
    jobTitle: string,
    companyName: string,
  ) {
    try {
      const logoHtml = this.getLogoHtml();
      const attachment = this.getLogoAttachment();
      const subject = `Congratulations! You've been selected for ${jobTitle}`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${this.getCommonStyles()}</style>
          </head>
          <body>
            <div class="container">
              ${logoHtml}
              <div class="content">
                <p class="greeting">Dear ${userName},</p>
                <p>We are pleased to inform you that you have been selected for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                <p>Our HR team will reach out to you shortly with the offer details and next steps.</p>
                <div class="divider"></div>
                <p style="color:#666666;font-size:14px;">Welcome to the team!<br>${companyName} HR Team</p>
              </div>
              ${this.getFooterHtml(new Date().getFullYear())}
            </div>
          </body>
        </html>
      `;

      await this.sendBrevoEmail(to, subject, html, this.htmlToText(html), attachment || undefined);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send offer email: ${error.message}`);
    }
  }

  async sendTestEmail(to: string) {
    try {
      const logoHtml = this.getLogoHtml();
      const attachment = this.getLogoAttachment();
      const subject = 'Test Email - WonNet';

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${this.getCommonStyles()}</style>
          </head>
          <body>
            <div class="container">
              ${logoHtml}
              <div class="content">
                <p class="greeting">Test Email</p>
                <p>This is a test email from WonNet.</p>
                <p style="color:#22c55e;">✅ Email system is working.</p>
                <div class="divider"></div>
                <p style="color:#666666;font-size:14px;">Best regards,<br>WonNet Team</p>
              </div>
              ${this.getFooterHtml(new Date().getFullYear())}
            </div>
          </body>
        </html>
      `;

      await this.sendBrevoEmail(to, subject, html, 'This is a test email from WonNet.', attachment || undefined);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send test email: ${error.message}`);
    }
  }
}