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
   * Submits a message for delivery.
   *
   * This method allows sending emails from a user account by providing
   * necessary message details such as recipients, subject, and content.
   *
   * @async
   * @function submitMessage
   * @param {string} userId - The ID of the user sending the message.
   * @param {object} message - The message details.
   * @param {string} message.mailbox - ID of the mailbox from which the message is sent.
   * @param {object} message.from - Address for the From header.
   * @param {string} [message.from.name] - Name of the sender.
   * @param {string} message.from.address - Email address of the sender.
   * @param {Array<object>} message.to - List of To recipients.
   * @param {string} [message.to[].name] - Name of the recipient.
   * @param {string} message.to[].address - Email address of the recipient.
   * @param {Array<object>} [message.cc] - List of CC recipients.
   * @param {Array<object>} [message.bcc] - List of BCC recipients.
   * @param {string} [message.subject] - Subject of the email.
   * @param {string} [message.text] - Plaintext version of the email content.
   * @param {string} [message.html] - HTML version of the email content.
   * @param {Array<object>} [message.attachments] - List of attachments.
   * @param {string} [message.sess] - Optional session identifier for logging.
   * @param {string} [message.ip] - Optional IP address for logging.
   * @returns {Promise<object>} A promise that resolves to the submitted message details.
   * @returns {boolean} return.success - Indicates if the submission was successful.
   * @returns {object} return.message - Details of the submitted message.
   * @returns {string} return.message.mailbox - Mailbox ID the message was stored to.
   * @returns {number} return.message.id - Message ID in the mailbox.
   * @returns {string} return.message.queueId - Queue ID in the MTA.
   *
   * @throws {Error} If the API request fails or the response is not successful.
   *
   * @example
   * // Submit a simple email
   * const response = await submission.submitMessage("user123", {
   *   mailbox: "mailbox456",
   *   from: { address: "sender@example.com", name: "Sender Name" },
   *   to: [{ address: "recipient@example.com", name: "Recipient Name" }],
   *   subject: "Hello",
   *   text: "This is a simple text message.",
   * });
   * console.log(response.success); // true
   * console.log(response.message.queueId); // "queue123"
   *
   * @example
   * // Submit an email with attachments
   * const response = await submission.submitMessage("user123", {
   *   mailbox: "mailbox456",
   *   from: { address: "sender@example.com" },
   *   to: [{ address: "recipient@example.com" }],
   *   subject: "Email with attachments",
   *   text: "Please find the attachments below.",
   *   attachments: [
   *     {
   *       filename: "example.txt",
   *       contentType: "text/plain",
   *       content: Buffer.from("Hello, world!").toString("base64"),
   *     },
   *   ],
   * });
   * console.log(response.message.id); // 789
   */
  public async submitMessage(
    userId: string,
    message: {
      mailbox: string;
      from: { name?: string; address: string };
      to: Array<{ name?: string; address: string }>;
      cc?: Array<{ name?: string; address: string }>;
      bcc?: Array<{ name?: string; address: string }>;
      subject?: string;
      text?: string;
      html?: string;
      attachments?: Array<{
        filename: string;
        contentType: string;
        content: string;
        cid?: string;
      }>;
      sess?: string;
      ip?: string;
    }
  ): Promise<{
    success: boolean;
    message: {
      mailbox: string;
      id: number;
      queueId: string;
    };
  }> {
    return this.client.post(`/users/${userId}/submit`, message);
  }
}
