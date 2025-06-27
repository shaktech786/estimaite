declare module 'resend' {
  export class Resend {
    constructor(apiKey: string | undefined);
    
    emails: {
      send(data: {
        from: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        replyTo?: string;
        cc?: string | string[];
        bcc?: string | string[];
        attachments?: Array<{
          filename: string;
          content: string | Buffer;
          contentType?: string;
        }>;
        tags?: Array<{
          name: string;
          value: string;
        }>;
      }): Promise<{
        id: string;
        from: string;
        to: string | string[];
        created_at: string;
        success: boolean;
        error?: {
          message: string;
          code: string;
        };
      }>;
    };
  }
}
