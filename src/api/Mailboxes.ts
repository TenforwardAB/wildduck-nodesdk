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
 * Created on 12/2/24 :: 9:39AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Mailboxes.ts is part of the wildduck-nodesdk.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling mailbox-related operations in the WildDuck API.
 * This class provides methods for listing, creating, retrieving, updating, and deleting mailboxes.
 *
 * @class Mailboxes
 */
export class Mailboxes {
  /**
   * @private
   * @property {ApiClient} client - The ApiClient instance used for making API requests.
   */
  private client: ApiClient;

  /**
   * Creates an instance of the Mailboxes class.
   *
   * @constructor
   * @private
   * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
   */
  constructor(client: ApiClient) {
    this.client = client;
  }

/**
 * List mailboxes for a specific user.
 *
 * This method retrieves a list of mailboxes for a user, optionally filtering based on special flags,
 * hidden status, counters, and sizes. It returns detailed information about each mailbox.
 *
 * @param {string} userId - The user's ID.
 * @param {Object} [params] - Query parameters for filtering mailboxes.
 * @param {boolean} [params.specialUse] - If true, include only folders with the `specialUse` flag set.
 * @param {boolean} [params.showHidden] - If true, include hidden folders.
 * @param {boolean} [params.counters] - If true, include counters (total + unseen).
 * @param {boolean} [params.sizes] - If true, include mailbox sizes in bytes.
 * @param {string} [params.sess] - Optional session identifier for logging.
 * @param {string} [params.ip] - Optional IP address for logging.
 * @returns {Promise<object>} A promise that resolves to the mailbox list.
 * @returns {boolean} return.success - Indicates whether the operation was successful.
 * @returns {Array<Object>} return.results - List of user mailboxes with detailed information.
 * @returns {string} return.results[].id - The unique ID of the mailbox.
 * @returns {string} return.results[].name - The name of the mailbox (unicode string).
 * @returns {string} return.results[].path - The full path of the mailbox (folders separated by slashes, ends with the mailbox name).
 * @returns {string|null} return.results[].specialUse - The special use identifier, or `null` if not set (e.g., Drafts, Junk, Sent, Trash).
 * @returns {number} return.results[].modifyIndex - The modification sequence number, incremented with every change in the mailbox.
 * @returns {boolean} return.results[].subscribed - Indicates whether the mailbox is subscribed (used by IMAP clients).
 * @returns {boolean} return.results[].hidden - Indicates whether the mailbox is hidden.
 * @returns {number} return.results[].retention - The retention policy for the mailbox (in ms). Messages added will be deleted after this time.
 * @returns {number} return.results[].total - The total number of messages stored in this mailbox.
 * @returns {number} return.results[].unseen - The number of unseen messages stored in this mailbox.
 * @returns {number} [return.results[].size] - The total size of the mailbox in bytes (only included if `sizes` is true in the query).
 *
 * @example
 * // Fetch all mailboxes for a user
 * const mailboxes = await mailboxes.listMailboxes("507f1f77bcf86cd799439011");
 *
 * @example
 * // Fetch hidden mailboxes with counters and sizes included
 * const mailboxes = await mailboxes.listMailboxes("507f1f77bcf86cd799439011", {
 *   showHidden: true,
 *   counters: true,
 *   sizes: true,
 * });
 */
public async listMailboxes(
  userId: string,
  params?: {
    specialUse?: boolean;
    showHidden?: boolean;
    counters?: boolean;
    sizes?: boolean;
    sess?: string;
    ip?: string;
  }
): Promise<{
  success: boolean;
  results: Array<{
    id: string;
    name: string;
    path: string;
    specialUse: string | null;
    modifyIndex: number;
    subscribed: boolean;
    hidden: boolean;
    retention: number;
    total: number;
    unseen: number;
    size?: number;
  }>;
}> {
  const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
  return this.client.get(`/users/${userId}/mailboxes${query}`);
}


  /**
   * Create a new mailbox for a specific user.
   *
   * @param {string} userId - The user's ID.
   * @param {Object} data - The mailbox creation data.
   * @param {string} data.path - Full path of the mailbox.
   * @param {boolean} [data.hidden] - If true, the folder is hidden.
   * @param {number} [data.retention] - Retention policy for the mailbox (in milliseconds).
   * @param {string} [data.sess] - Optional session identifier for logging.
   * @param {string} [data.ip] - Optional IP address for logging.
   * @returns {Promise<object>} A promise that resolves to the creation result.
   *
   * @example
   * const mailbox = await mailboxes.createMailbox("507f1f77bcf86cd799439011", { path: "Inbox/NewFolder" });
   */
  public async createMailbox(
    userId: string,
    data: {
      path: string;
      hidden?: boolean;
      retention?: number;
      sess?: string;
      ip?: string;
    }
  ): Promise<{ success: boolean; id: string }> {
    return this.client.post(`/users/${userId}/mailboxes`, data);
  }

  /**
   * Get information about a specific mailbox.
   *
   * @param {string} userId - The user's ID.
   * @param {string} mailboxId - The mailbox ID or "resolve".
   * @param {Object} [params] - Query parameters.
   * @param {string} [params.path] - If "resolve" is used, specify the mailbox path.
   * @param {string} [params.sess] - Optional session identifier for logging.
   * @param {string} [params.ip] - Optional IP address for logging.
   * @returns {Promise<object>} A promise that resolves to the mailbox details.
   *
   * @example
   * const mailbox = await mailboxes.getMailbox("507f1f77bcf86cd799439011", "mailboxId");
   */
  public async getMailbox(
    userId: string,
    mailboxId: string,
    params?: { path?: string; sess?: string; ip?: string }
  ): Promise<{
    success: boolean;
    id: string;
    name: string;
    path: string;
    specialUse: string | null;
    modifyIndex: number;
    subscribed: boolean;
    hidden: boolean;
    total: number;
    unseen: number;
  }> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
    return this.client.get(`/users/${userId}/mailboxes/${mailboxId}${query}`);
  }

  /**
   * Update a mailbox for a specific user.
   *
   * @param {string} userId - The user's ID.
   * @param {string} mailboxId - The mailbox ID.
   * @param {Object} updates - The mailbox updates.
   * @param {string} [updates.path] - New path for the mailbox.
   * @param {number} [updates.retention] - New retention policy (in milliseconds).
   * @param {boolean} [updates.subscribed] - Subscription state for the mailbox.
   * @param {boolean} [updates.hidden] - Hidden state for the mailbox.
   * @param {string} [updates.sess] - Optional session identifier for logging.
   * @param {string} [updates.ip] - Optional IP address for logging.
   * @returns {Promise<object>} A promise that resolves to the update result.
   *
   * @example
   * const result = await mailboxes.updateMailbox("507f1f77bcf86cd799439011", "mailboxId", { hidden: true });
   */
  public async updateMailbox(
    userId: string,
    mailboxId: string,
    updates: {
      path?: string;
      retention?: number;
      subscribed?: boolean;
      hidden?: boolean;
      sess?: string;
      ip?: string;
    }
  ): Promise<{ success: boolean }> {
    return this.client.put(`/users/${userId}/mailboxes/${mailboxId}`, updates);
  }

  /**
   * Delete a mailbox for a specific user.
   *
   * @param {string} userId - The user's ID.
   * @param {string} mailboxId - The mailbox ID.
   * @param {Object} [params] - Query parameters.
   * @param {string} [params.sess] - Optional session identifier for logging.
   * @param {string} [params.ip] - Optional IP address for logging.
   * @returns {Promise<object>} A promise that resolves to the deletion result.
   *
   * @example
   * const result = await mailboxes.deleteMailbox("507f1f77bcf86cd799439011", "mailboxId");
   */
  public async deleteMailbox(
    userId: string,
    mailboxId: string,
    params?: { sess?: string; ip?: string }
  ): Promise<{ success: boolean }> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
    return this.client.delete(`/users/${userId}/mailboxes/${mailboxId}${query}`);
  }
}
