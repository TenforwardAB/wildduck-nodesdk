/**
 * This file is licensed under the European Union Public License (EUPL) v1.2.
 * You may only use this work in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed "as is",
 * without any warranty or conditions of any kind.
 *
 * Created on 12/2/24 :: 11:41AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Submission.ts is part of the wildduck-nodesdk.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling message submission operations in the WildDuck API.
 * This class provides methods for sending emails from a user account.
 *
 * @class Submission
 */
export class Submission {
  /**
   * @private
   * @property {ApiClient} client - The ApiClient instance used for making API requests.
   */
  private client: ApiClient;

  /**
   * Creates an instance of the Submission class.
   *
   * @constructor
   * @private
   * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
   *
   * @example
   * // Example instantiation of the Submission class
   * const submission = new Submission(apiClient);
   */
  constructor(client: ApiClient) {
    this.client = client;
  }

    /**
     * Submits an email message for delivery from a user account.
     *
     * This method allows sending an email with optional attachments, custom headers, and additional metadata.
     * It supports direct email delivery or upload-only mode, where the message is stored but not sent.
     *
     * @async
     * @function submitMessage
     * @param {string} user - The user ID sending the email.
     * @param {Object} payload - The email details including recipients, subject, and message body.
     * @param {string} payload.mailbox - The ID of the mailbox from which the email is sent.
     * @param {Object} payload.from - Sender's email address.
     * @param {string} payload.from.name - Sender's display name.
     * @param {string} payload.from.address - Sender's email address.
     * @param {Object[]} payload.to - Array of recipient email addresses.
     * @param {string} payload.to[].name - Recipient's name.
     * @param {string} payload.to[].address - Recipient's email address.
     * @param {Object[]} [payload.cc] - Array of CC email addresses.
     * @param {Object[]} [payload.bcc] - Array of BCC email addresses.
     * @param {Object[]} [payload.headers] - Custom email headers.
     * @param {string} payload.headers[].key - Header key.
     * @param {string} payload.headers[].value - Header value.
     * @param {string} payload.subject - Email subject.
     * @param {string} payload.text - Plaintext email content.
     * @param {string} [payload.html] - HTML formatted email content.
     * @param {Object[]} [payload.attachments] - Array of attachments.
     * @param {string} payload.attachments[].filename - Attachment filename.
     * @param {string} payload.attachments[].contentType - MIME type of the attachment.
     * @param {string} payload.attachments[].content - Base64 encoded attachment content.
     * @param {Object} [payload.meta] - Optional metadata for the email.
     * @param {string} [payload.sess] - Session identifier for logging.
     * @param {string} [payload.ip] - IP address for logging.
     * @param {boolean} [payload.uploadOnly] - If true, the message is stored but not sent.
     *
     * @returns {Promise<Object>} A promise that resolves to the submission response.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {Object} return.message - Information about the submitted message.
     * @returns {string} return.message.mailbox - The mailbox ID where the message was stored.
     * @returns {number} return.message.id - The message ID in the mailbox.
     * @returns {string} return.message.queueId - The queue ID in the mail transport agent (MTA).
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * // Submit a plain text email
     * const response = await submissions.submitMessage("507f1f77bcf86cd799439011", {
     *   mailbox: "mailbox123",
     *   from: { name: "John Doe", address: "john@example.com" },
     *   to: [{ name: "Jane Doe", address: "jane@example.com" }],
     *   subject: "Hello from WildDuck",
     *   text: "This is a test email.",
     * });
     * console.log(response.success); // true
     *
     * @example
     * // Submit an email with an attachment
     * const response = await submissions.submitMessage("507f1f77bcf86cd799439011", {
     *   mailbox: "mailbox123",
     *   from: { name: "John Doe", address: "john@example.com" },
     *   to: [{ name: "Jane Doe", address: "jane@example.com" }],
     *   subject: "Invoice",
     *   text: "Please find attached the invoice.",
     *   attachments: [{
     *     filename: "invoice.pdf",
     *     contentType: "application/pdf",
     *     content: "JVBERi0xLjQKJ... (Base64 encoded content)"
     *   }]
     * });
     * console.log(response.message.queueId); // Queue ID in MTA
     *
     * @example
     * // Upload a message without sending it
     * const response = await submissions.submitMessage("507f1f77bcf86cd799439011", {
     *   mailbox: "mailbox123",
     *   from: { name: "John Doe", address: "john@example.com" },
     *   to: [{ name: "Jane Doe", address: "jane@example.com" }],
     *   subject: "Draft Email",
     *   text: "This is a draft email.",
     *   uploadOnly: true
     * });
     * console.log(response.message.id); // Message ID in mailbox
     */
    public async submitMessage(
        user: string,
        payload: {
            mailbox: string;
            from: { name: string; address: string };
            replyTo?: { name: string; address: string };
            to: { name: string; address: string }[];
            cc?: { name: string; address: string }[];
            bcc?: { name: string; address: string }[];
            headers?: { key: string; value: string }[];
            subject: string;
            text: string;
            html?: string;
            attachments?: {
                filename: string;
                contentType: string;
                encoding?: string;
                contentTransferEncoding?: string;
                contentDisposition?: "inline" | "attachment";
                content: string;
                cid?: string;
            }[];
            meta?: Record<string, any>;
            sess?: string;
            ip?: string;
            reference?: {
                mailbox: string;
                id: number;
                action: "reply" | "replyAll" | "forward";
            };
            isDraft?: boolean;
            draft?: { mailbox: string; id: number };
            sendTime?: string;
            uploadOnly?: boolean;
            envelope?: {
                from: { name?: string; address: string };
                to: { name?: string; address: string }[];
            };
        }
    ): Promise<{
        success: boolean;
        message: {
            mailbox: string;
            id: number;
            queueId: string;
        };
    }> {
        return this.client.post(`/users/${user}/submit`, payload);
    }
}
