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
 * Created on 12/2/24 :: 9:57AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Messages.ts is part of the wildduck-nodesdk.
 */

import {Buffer} from "buffer";

import {ApiClient} from "../utils/ApiClient";

/**
 * A class for handling message-related operations in the WildDuck API.
 * This class provides methods for listing, updating, deleting, uploading, and searching messages.
 *
 * @class Messages
 */
export class Messages {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Messages class.
     *
     * @constructor
     * @private
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Lists all messages in a mailbox.
     *
     * @async
     * @function listMessages
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The mailbox's ID.
     * @param {Object} [params] - Query parameters for filtering messages.
     * @param {boolean} [params.unseen] - If true, return only unseen messages.
     * @param {boolean} [params.metaData] - If true, include metadata in the response.
     * @param {boolean} [params.threadCounters] - If true, include thread message counts.
     * @param {number} [params.limit] - Number of records to return.
     * @param {string} [params.order] - "asc" or "desc" for record ordering.
     * @param {string} [params.next] - Cursor value for the next page.
     * @param {string} [params.previous] - Cursor value for the previous page.
     * @param {string} [params.includeHeaders] - Comma-separated list of headers to include in the response.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves to the list of messages.
     *
     * @example
     * const messages = await messages.listMessages("507f1f77bcf86cd799439011", "mailbox123", { unseen: true });
     */
    public async listMessages(
        userId: string,
        mailboxId: string,
        params?: {
            unseen?: boolean;
            metaData?: boolean;
            threadCounters?: boolean;
            limit?: number;
            order?: "asc" | "desc";
            next?: string;
            previous?: string;
            includeHeaders?: string;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        total: number;
        page: number;
        previousCursor: string | boolean;
        nextCursor: string | boolean;
        specialUse: string;
        results: any[];
    }> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
        return this.client.get(`/users/${userId}/mailboxes/${mailboxId}/messages${query}`);
    }

    /**
     * Updates message flags or moves messages to a different mailbox.
     *
     * @async
     * @function updateMessages
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The mailbox's ID.
     * @param {Object} data - The update data for the messages.
     * @param {string} data.message - Message ID(s) or range.
     * @param {string} [data.moveTo] - ID of the target mailbox for moving messages.
     * @param {boolean} [data.seen] - State of the \Seen flag.
     * @param {boolean} [data.deleted] - State of the \Deleted flag.
     * @param {boolean} [data.flagged] - State of the \Flagged flag.
     * @param {boolean} [data.draft] - State of the \Draft flag.
     * @param {string | boolean} [data.expires] - Expiration date or false to turn off auto-expiration.
     * @param {object} [data.metaData] - Optional metadata.
     * @param {string} [data.sess] - Optional session identifier for logging.
     * @param {string} [data.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves to the update result.
     *
     * @example
     * const updateResult = await messages.updateMessages("507f1f77bcf86cd799439011", "mailbox123", {
     *   message: "1,2,3",
     *   seen: true
     * });
     */
    public async updateMessages(
        userId: string,
        mailboxId: string,
        data: {
            message: string;
            moveTo?: string;
            seen?: boolean;
            deleted?: boolean;
            flagged?: boolean;
            draft?: boolean;
            expires?: string | boolean;
            metaData?: object;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        id?: [string, string][];
        mailbox?: string;
        updated?: number;
    }> {
        return this.client.put(`/users/${userId}/mailboxes/${mailboxId}/messages`, data);
    }

    /**
     * Deletes all messages from a mailbox.
     *
     * @async
     * @function deleteMessages
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The mailbox's ID.
     * @param {Object} [params] - Query parameters for deletion.
     * @param {boolean} [params.async] - If true, schedule a deletion task.
     * @param {boolean} [params.skipArchive] - If true, skip archived messages.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves to the deletion result.
     *
     * @example
     * const deleteResult = await messages.deleteMessages("507f1f77bcf86cd799439011", "mailbox123", { async: true });
     */
    public async deleteMessages(
        userId: string,
        mailboxId: string,
        params?: { async?: boolean; skipArchive?: boolean; sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        deleted: number;
        errors: number;
    }> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
        return this.client.delete(`/users/${userId}/mailboxes/${mailboxId}/messages${query}`);
    }

    /**
     * Uploads a message to a mailbox.
     *
     * This method allows you to upload either an RFC822 formatted message or a structured message
     * to a specified mailbox. The raw message, if provided, overrides other message configuration.
     *
     * @async
     * @function uploadMessage
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The mailbox's ID.
     * @param {Object} data - The message data to upload.
     * @param {string} [data.date] - Date of the message.
     * @param {boolean} [data.unseen] - If true, marks the message as unseen.
     * @param {boolean} [data.flagged] - If true, marks the message as flagged.
     * @param {boolean} [data.draft] - If true, marks the message as a draft.
     * @param {string} [data.raw] - Base64 encoded raw message (overrides other fields if provided).
     * @param {Object} [data.from] - Address for the "From" header.
     * @param {Object[]} [data.to] - Addresses for the "To" header.
     * @param {Object[]} [data.cc] - Addresses for the "Cc" header.
     * @param {Object[]} [data.bcc] - Addresses for the "Bcc" header.
     * @param {string} [data.subject] - Subject of the message.
     * @param {string} [data.text] - Plaintext body of the message.
     * @param {string} [data.html] - HTML formatted body of the message.
     * @param {Object[]} [data.attachments] - Attachments for the message.
     * @param {Object} [data.metaData] - Optional metadata.
     * @param {string} [data.sess] - Optional session identifier for logging.
     * @param {string} [data.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves to the uploaded message details.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {object} return.message - Uploaded message details.
     * @returns {number} return.message.id - Message ID in the mailbox.
     * @returns {string} return.message.mailbox - Mailbox ID where the message was stored.
     * @returns {number} return.message.size - Size of the RFC822 formatted email.
     * @returns {boolean} [return.previousDeleted] - Indicates if a previous draft was deleted.
     * @returns {string} [return.previousDeleteError] - Error message if the previous delete failed.
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * const uploadResult = await messages.uploadMessage(
     *   "507f1f77bcf86cd799439011",
     *   "mailbox123",
     *   { subject: "Hello World", text: "This is a test email." }
     * );
     * console.log(uploadResult.message.id); // Message ID
     */
    public async uploadMessage(
        userId: string,
        mailboxId: string,
        data: {
            date?: string;
            unseen?: boolean;
            flagged?: boolean;
            draft?: boolean;
            raw?: string;
            from?: { name?: string; address: string };
            to?: { name?: string; address: string }[];
            cc?: { name?: string; address: string }[];
            bcc?: { name?: string; address: string }[];
            subject?: string;
            text?: string;
            html?: string;
            attachments?: { filename: string; content: string }[];
            metaData?: object;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        message: {
            id: number;
            mailbox: string;
            size: number;
        };
        previousDeleted?: boolean;
        previousDeleteError?: string;
    }> {
        return this.client.post(`/users/${userId}/mailboxes/${mailboxId}/messages`, data);
    }

    /**
     * Searches for messages matching specified criteria.
     *
     * This method allows querying for messages based on various parameters such as mailbox, message ID, thread ID,
     * or specific metadata. It supports filtering by size, flags, and other attributes, and includes pagination support.
     *
     * @async
     * @function searchMessages
     * @param {string} userId - The user's ID.
     * @param {Object} [params] - Query parameters for searching messages.
     * @param {string} [params.q] - Additional query string.
     * @param {string} [params.mailbox] - ID of the mailbox.
     * @param {string} [params.id] - Message ID values, used with mailbox.
     * @param {string} [params.thread] - Thread ID.
     * @param {string} [params.query] - Search string for full-text search.
     * @param {string} [params.datestart] - Datestring for the earliest message storing time.
     * @param {string} [params.dateend] - Datestring for the latest message storing time.
     * @param {string} [params.from] - Partial match for the "From" header.
     * @param {string} [params.to] - Partial match for the "To" and "Cc" headers.
     * @param {string} [params.subject] - Partial match for the "Subject" header.
     * @param {number} [params.minSize] - Minimal message size in bytes.
     * @param {number} [params.maxSize] - Maximal message size in bytes.
     * @param {boolean} [params.attachments] - If true, matches only messages with attachments.
     * @param {boolean} [params.flagged] - If true, matches only flagged messages.
     * @param {boolean} [params.unseen] - If true, matches only unseen messages.
     * @param {boolean} [params.searchable] - If true, excludes messages in Junk or Trash folders.
     * @param {string} [params.includeHeaders] - Comma-separated list of headers to include in the response.
     * @param {boolean} [params.threadCounters] - If true, includes thread message count in the response.
     * @param {number} [params.limit] - Number of records to return.
     * @param {string} [params.order] - Sorting order (asc or desc) by insert date.
     * @param {string} [params.next] - Cursor value for the next page.
     * @param {string} [params.previous] - Cursor value for the previous page.
     * @param {number} [params.page] - Current page number.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves to the search results.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.query - The query string used for the search.
     * @returns {number} return.total - Total number of messages found.
     * @returns {number} return.page - Current page number.
     * @returns {string | boolean} return.previousCursor - Cursor for the previous page or `false` if not available.
     * @returns {string | boolean} return.nextCursor - Cursor for the next page or `false` if not available.
     * @returns {Array<object>} return.results - List of messages matching the query.
     * @returns {number} return.results[].id - Message ID.
     * @returns {string} return.results[].mailbox - ID of the mailbox containing the message.
     * @returns {string} return.results[].thread - Thread ID of the message.
     * @returns {number} [return.results[].threadMessageCount] - Count of messages in the thread (if threadCounters was true).
     * @returns {object} return.results[].from - Sender details.
     * @returns {Array<object>} return.results[].to - Recipients in the "To" field.
     * @returns {Array<object>} return.results[].cc - Recipients in the "Cc" field.
     * @returns {Array<object>} return.results[].bcc - Recipients in the "Bcc" field.
     * @returns {string} return.results[].messageId - Message ID.
     * @returns {string} return.results[].subject - Subject of the message.
     * @returns {string} return.results[].date - Date string from the header.
     * @returns {string} [return.results[].idate] - Date string of receive time.
     * @returns {string} return.results[].intro - First 128 bytes of the message.
     * @returns {boolean} return.results[].attachments - Whether the message has attachments.
     * @returns {number} return.results[].size - Size of the message in bytes.
     * @returns {boolean} return.results[].seen - Whether the message is seen or not.
     * @returns {boolean} return.results[].deleted - Whether the message has a "Deleted" flag.
     * @returns {boolean} return.results[].flagged - Whether the message is flagged.
     * @returns {boolean} return.results[].draft - Whether the message is a draft.
     * @returns {boolean} return.results[].answered - Whether the message has an "Answered" flag.
     * @returns {boolean} return.results[].forwarded - Whether the message has a "$Forwarded" flag.
     * @returns {object} return.results[].metaData - Custom metadata (if requested).
     * @returns {object} return.results[].headers - Headers included in the response (if requested).
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * // Search for unseen messages in a mailbox
     * const searchResults = await messages.searchMessages("507f1f77bcf86cd799439011", {
     *   mailbox: "inbox",
     *   unseen: true,
     *   limit: 10,
     *   order: "desc",
     * });
     * console.log(searchResults.results);
     */
    public async searchMessages(
        userId: string,
        params?: {
            q?: string;
            mailbox?: string;
            id?: string;
            thread?: string;
            query?: string;
            datestart?: string;
            dateend?: string;
            from?: string;
            to?: string;
            subject?: string;
            minSize?: number;
            maxSize?: number;
            attachments?: boolean;
            flagged?: boolean;
            unseen?: boolean;
            searchable?: boolean;
            includeHeaders?: string;
            threadCounters?: boolean;
            limit?: number;
            order?: "asc" | "desc";
            next?: string;
            previous?: string;
            page?: number;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        query: string;
        total: number;
        page: number;
        previousCursor: string | boolean;
        nextCursor: string | boolean;
        results: Array<{
            id: number;
            mailbox: string;
            thread: string;
            threadMessageCount?: number;
            from: { name: string; address: string };
            to: { name: string; address: string }[];
            cc: { name: string; address: string }[];
            bcc: { name: string; address: string }[];
            messageId: string;
            subject: string;
            date: string;
            idate?: string;
            intro: string;
            attachments: boolean;
            size: number;
            seen: boolean;
            deleted: boolean;
            flagged: boolean;
            draft: boolean;
            answered: boolean;
            forwarded: boolean;
            metaData?: object;
            headers?: object;
        }>;
    }> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
        return this.client.get(`/users/${userId}/search${query}`);
    }

    /**
     * Search and update messages in a user's mailbox.
     *
     * This method applies specified actions (e.g., move, mark as seen, or flagged) to all matching messages.
     * The operation is asynchronous, meaning it returns immediately while the actual modifications are processed in the background.
     *
     * @async
     * @function searchAndUpdateMessages
     * @param {string} userId - The user's ID.
     * @param {Object} params - Search criteria and actions to apply.
     * @param {string} [params.q] - Additional query string.
     * @param {string} [params.mailbox] - ID of the mailbox to search in.
     * @param {string} [params.id] - Message ID values, used with mailbox.
     * @param {string} [params.thread] - Thread ID.
     * @param {string} [params.query] - Search string for full-text search.
     * @param {string} [params.datestart] - Datestring for the earliest message storing time.
     * @param {string} [params.dateend] - Datestring for the latest message storing time.
     * @param {string} [params.from] - Partial match for the "From" header.
     * @param {string} [params.to] - Partial match for the "To" and "Cc" headers.
     * @param {string} [params.subject] - Partial match for the "Subject" header.
     * @param {number} [params.minSize] - Minimal message size in bytes.
     * @param {number} [params.maxSize] - Maximal message size in bytes.
     * @param {boolean} [params.attachments] - If true, matches only messages with attachments.
     * @param {boolean} [params.flagged] - If true, matches only flagged messages.
     * @param {boolean} [params.unseen] - If true, matches only unseen messages.
     * @param {boolean} [params.searchable] - If true, excludes messages in Junk or Trash folders.
     * @param {string} [params.includeHeaders] - Comma-separated list of headers to include in the response.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @param {Object} params.action - Actions to apply to the matching messages.
     * @param {string} [params.action.moveTo] - ID of the target mailbox to move messages to.
     * @param {boolean} [params.action.seen] - State of the \Seen flag.
     * @param {boolean} [params.action.flagged] - State of the \Flagged flag.
     * @returns {Promise<object>} A promise that resolves to the operation status.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.scheduled - ID of the scheduled operation.
     * @returns {boolean} return.existing - Indicates whether the operation was already scheduled.
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * // Search for unseen messages in a mailbox and mark them as seen
     * const result = await messages.searchAndUpdateMessages("507f1f77bcf86cd799439011", {
     *   mailbox: "inbox",
     *   unseen: true,
     *   action: { seen: true }
     * });
     * console.log(result.success); // true or false
     * console.log(result.scheduled); // ID of the scheduled operation
     */
    public async searchAndUpdateMessages(
        userId: string,
        params: {
            q?: string;
            mailbox?: string;
            id?: string;
            thread?: string;
            query?: string;
            datestart?: string;
            dateend?: string;
            from?: string;
            to?: string;
            subject?: string;
            minSize?: number;
            maxSize?: number;
            attachments?: boolean;
            flagged?: boolean;
            unseen?: boolean;
            searchable?: boolean;
            includeHeaders?: string;
            sess?: string;
            ip?: string;
            action: {
                moveTo?: string;
                seen?: boolean;
                flagged?: boolean;
            };
        }
    ): Promise<{
        success: boolean;
        scheduled: string;
        existing: boolean;
    }> {
        return this.client.post(`/users/${userId}/search`, params);
    }

    /**
     * Fetch detailed information about a specific message in a mailbox.
     *
     * This method retrieves comprehensive details about a specific message, including metadata, flags, attachments, and security verification results.
     *
     * @async
     * @function getMessageInfo
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The ID of the mailbox containing the message.
     * @param {number} messageId - The ID of the specific message.
     * @param {Object} [params] - Optional query parameters.
     * @param {boolean} [params.replaceCidLinks] - If true, replaces `cid` links in the message.
     * @param {boolean} [params.markAsSeen] - If true, marks the message as seen.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves to the message details.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {number} return.id - The message ID.
     * @returns {string} return.mailbox - The mailbox ID where the message resides.
     * @returns {string} return.user - The user ID.
     * @returns {object} return.envelope - SMTP envelope details, if available.
     * @returns {object} return.from - The sender's address details.
     * @returns {object} return.to - Recipients in the "To" field.
     * @returns {object} return.cc - Recipients in the "Cc" field.
     * @returns {object} return.bcc - Recipients in the "Bcc" field (usually only for drafts).
     * @returns {string} return.subject - The subject of the message.
     * @returns {string} return.messageId - The message ID from the header.
     * @returns {string} return.date - The date from the message header.
     * @returns {string} return.idate - The receive date of the message.
     * @returns {string} return.text - The plain text content of the message.
     * @returns {Array<string>} return.html - An array of HTML strings, representing the message content.
     * @returns {boolean} return.seen - Indicates if the message is marked as seen.
     * @returns {boolean} return.draft - Indicates if the message is a draft.
     * @returns {boolean} return.flagged - Indicates if the message is flagged.
     * @returns {boolean} return.deleted - Indicates if the message is marked for deletion.
     * @returns {Array<object>} return.attachments - Details of message attachments.
     * @returns {object} return.metaData - Custom metadata set for the message.
     * @returns {boolean} return.answered - Indicates if the message has been answered.
     * @returns {boolean} return.forwarded - Indicates if the message has been forwarded.
     * @returns {boolean} return.encrypted - Indicates if the message is encrypted.
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * // Retrieve information about a specific message
     * const messageInfo = await messages.getMessageInfo(
     *   "507f1f77bcf86cd799439011",
     *   "inbox",
     *   12345,
     *   { markAsSeen: true }
     * );
     * console.log(messageInfo.subject); // "Your order confirmation"
     */
    public async getMessageInfo(
        userId: string,
        mailboxId: string,
        messageId: number,
        params?: {
            replaceCidLinks?: boolean;
            markAsSeen?: boolean;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        id: number;
        mailbox: string;
        user: string;
        envelope: object;
        from: { name: string; address: string };
        to: Array<{ name: string; address: string }>;
        cc: Array<{ name: string; address: string }>;
        bcc: Array<{ name: string; address: string }>;
        subject: string;
        messageId: string;
        date: string;
        idate: string;
        text: string;
        html: Array<string>;
        seen: boolean;
        draft: boolean;
        flagged: boolean;
        deleted: boolean;
        attachments: Array<{
            id: string;
            hash: string;
            filename: string;
            contentType: string;
            disposition: string;
            transferEncoding: string;
            related: boolean;
            sizeKb: number;
        }>;
        metaData: object;
        answered: boolean;
        forwarded: boolean;
        encrypted: boolean;
    }> {
        const query = params
            ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
            : "";
        return this.client.get(`/users/${userId}/mailboxes/${mailboxId}/messages/${messageId}${query}`);
    }

    /**
     * Update message flags or move a message to another mailbox.
     *
     * @async
     * @function updateMessage
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The ID of the mailbox.
     * @param {string} messageId - The message ID (can be a range or comma-separated).
     * @param {Object} updates - The update parameters.
     * @param {string} [updates.moveTo] - Target mailbox ID to move the message to.
     * @param {boolean} [updates.seen] - State of the \Seen flag.
     * @param {boolean} [updates.deleted] - State of the \Deleted flag.
     * @param {boolean} [updates.flagged] - State of the \Flagged flag.
     * @param {boolean} [updates.draft] - State of the \Draft flag.
     * @param {string | boolean} [updates.expires] - Expiration date or false to disable expiration.
     * @param {object} [updates.metaData] - Custom metadata for the message.
     * @param {string} [updates.sess] - Optional session identifier for logging.
     * @param {string} [updates.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves with the update status.
     */
    public async updateMessage(
        userId: string,
        mailboxId: string,
        messageId: string,
        updates: {
            moveTo?: string;
            seen?: boolean;
            deleted?: boolean;
            flagged?: boolean;
            draft?: boolean;
            expires?: string | boolean;
            metaData?: object;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        id?: Array<[string, string]>;
        mailbox?: string;
        updated?: number;
    }> {
        return this.client.put(`/users/${userId}/mailboxes/${mailboxId}/messages/${messageId}`, updates);
    }

    /**
     * Delete a specific message.
     *
     * @async
     * @function deleteMessage
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The ID of the mailbox.
     * @param {number} messageId - The ID of the message to delete.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves with the deletion status.
     */
    public async deleteMessage(
        userId: string,
        mailboxId: string,
        messageId: number,
        params?: { sess?: string; ip?: string }
    ): Promise<{ success: boolean }> {
        const query = params
            ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
            : "";
        return this.client.delete(`/users/${userId}/mailboxes/${mailboxId}/messages/${messageId}${query}`);
    }

    /**
     * Get the RFC822 formatted source of a message.
     *
     * @async
     * @function getMessageSource
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The ID of the mailbox.
     * @param {number} messageId - The ID of the message.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<{ success: string }>} A promise that resolves to the message source.
     */
    public async getMessageSource(
        userId: string,
        mailboxId: string,
        messageId: number,
        params?: { sess?: string; ip?: string }
    ): Promise<{ success: string }> {
        const query = params
            ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
            : "";
        return this.client.get(`/users/${userId}/mailboxes/${mailboxId}/messages/${messageId}/message.eml${query}`, {}, "arraybuffer");
    }


    /**
     * Downloads an attachment from a message.
     *
     * This method retrieves an attachment from a specific message within a user's mailbox.
     * The attachment can be returned as either binary data (Buffer) or a string, depending
     * on the `sendAsString` parameter.
     *
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The ID of the mailbox.
     * @param {number} messageId - The ID of the message.
     * @param {string} attachmentId - The ID of the attachment.
     * @param {boolean} [sendAsString=false] - If true, the attachment is returned as a string. Otherwise, it is returned as a Buffer.
     * @returns {Promise<string | Buffer>} A promise that resolves to the attachment contents.
     *
     * @throws {Error} If the request fails.
     *
     * @example
     * // Get attachment as binary data
     * const attachmentBuffer = await messages.downloadAttachment(
     *   "user123",
     *   "mailbox456",
     *   789,
     *   "attachment001"
     * );
     * console.log(attachmentBuffer instanceof Buffer); // true
     *
     * @example
     * // Get attachment as a string
     * const attachmentString = await messages.downloadAttachment(
     *   "user123",
     *   "mailbox456",
     *   789,
     *   "attachment001",
     *   true
     * );
     * console.log(typeof attachmentString); // "string"
     */
    public async downloadAttachment(
        userId: string,
        mailboxId: string,
        messageId: number,
        attachmentId: string,
        sendAsString: boolean = false
    ): Promise<string | Buffer> {
        const endpoint = `/users/${userId}/mailboxes/${mailboxId}/messages/${messageId}/attachments/${attachmentId}`;
        const query = sendAsString ? "?sendAsString=true" : "";
        const responseType = sendAsString ? "text" : "arraybuffer";

        const response = await this.client.get(`${endpoint}${query}`, {}, responseType);

        if (sendAsString) {
            return response as string;
        } else {
            return Buffer.from(response as ArrayBuffer);
        }
    }

    /**
     * Forward a stored message.
     *
     * @async
     * @function forwardMessage
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The ID of the mailbox.
     * @param {number} messageId - The ID of the message to forward.
     * @param {Object} payload - Forwarding parameters.
     * @param {number} [payload.target] - Original forwarding target.
     * @param {string[]} [payload.addresses] - Additional forward targets.
     * @param {string} [payload.sess] - Optional session identifier for logging.
     * @param {string} [payload.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves with forwarding details.
     */
    public async forwardMessage(
        userId: string,
        mailboxId: string,
        messageId: number,
        payload: {
            target?: number;
            addresses?: string[];
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        queueId: string;
        forwarded: Array<{
            seq: string;
            type: string;
            value: string;
        }>;
    }> {
        return this.client.post(`/users/${userId}/mailboxes/${mailboxId}/messages/${messageId}/forward`, payload);
    }

    /**
     * Submit a draft message for delivery.
     *
     * @async
     * @function submitDraft
     * @param {string} userId - The user's ID.
     * @param {string} mailboxId - The ID of the mailbox.
     * @param {number} messageId - The ID of the draft message to submit.
     * @param {Object} payload - Submission parameters.
     * @param {boolean} [payload.deleteFiles] - If true, deletes attachment files in metaData.files.
     * @param {string} [payload.sendTime] - Delivery time for the message.
     * @param {string} [payload.sess] - Optional session identifier for logging.
     * @param {string} [payload.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves with submission details.
     */
    public async submitDraft(
        userId: string,
        mailboxId: string,
        messageId: number,
        payload: {
            deleteFiles?: boolean;
            sendTime?: string;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        queueId: string;
        message: {
            id: number;
            mailbox: string;
            size: number;
        };
    }> {
        return this.client.post(`/users/${userId}/mailboxes/${mailboxId}/messages/${messageId}/submit`, payload);
    }

    /**
     * Delete an outbound message from the queue.
     *
     * @async
     * @function deleteOutboundMessage
     * @param {string} userId - The user's ID.
     * @param {string} queueId - The outbound queue ID of the message.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<object>} A promise that resolves with the deletion status.
     */
    public async deleteOutboundMessage(
        userId: string,
        queueId: string,
        params?: { sess?: string; ip?: string }
    ): Promise<{ success: boolean }> {
        const query = params
            ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
            : "";
        return this.client.delete(`/users/${userId}/outbound/${queueId}${query}`);
    }

}
