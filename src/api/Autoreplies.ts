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
 * Copyright (c) 2024- Tenforward AB. All rights reserved.
 *
 * Created on 4/7/25 :: 3:43PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Autoreplies.ts is part of the wildduck-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

/**
 * A class for handling Autoreply operations in the WildDuck API.
 * This class provides methods for listing, creating, updating Autoreplies.
 *
 * @class Autoreplies
 */
export class Autoreplies {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Autoreplies class.
     *
     * @constructor
     * @private
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Get Autoreply Information.
     *
     * This method retrieves the autoreply information for a specific user.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {Object} [params] - Optional query parameters for logging.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the autoreply information.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {boolean} return.status - Indicates if the autoreply is enabled (true) or not (false).
     * @returns {string} return.name - The name used in the From: header for the autoreply.
     * @returns {string} return.subject - Subject line for the autoreply. If empty, uses the subject of the original message.
     * @returns {string} return.text - Plaintext formatted content of the autoreply message.
     * @returns {string} return.html - HTML formatted content of the autoreply message.
     * @returns {string|boolean} return.start - Datestring of when the autoreply starts or false to disable start checks.
     * @returns {string|boolean} return.end - Datestring of when the autoreply ends or false to disable end checks.
     * @returns {string} return.created - Datestring of when the autoreply was created.
     *
     * @example
     * // Get autoreply information for a user
     * const autoreplyInfo = await autoreplies.getAutoreplyInformation("507f1f77bcf86cd799439011", {
     *   sess: "sess123",
     *   ip: "192.168.0.1"
     * });
     * console.log(autoreplyInfo.success); // true
     */
    public async getAutoreplyInformation(
        user: string,
        params?: {
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        status: boolean;
        name: string;
        subject: string;
        text: string;
        html: string;
        start: string | boolean;
        end: string | boolean;
        created: string;
    }> {
        const queryParams = params
            ? new URLSearchParams(params as Record<string, string>).toString()
            : "";
        const query = queryParams ? `?${queryParams}` : "";
        return this.client.get(`/users/${user}/autoreply${query}`);
    }

    /**
     * Update Autoreply Information.
     *
     * This method updates the autoreply information for a specific user.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {Object} autoReplyData - The updated autoreply data.
     * @param {boolean} autoReplyData.status - Indicates if the autoreply is enabled (true) or not (false).
     * @param {string} autoReplyData.name - The name used in the From: header for the autoreply message.
     * @param {string} autoReplyData.subject - The subject line for the autoreply. If empty, uses the subject of the original message.
     * @param {string} autoReplyData.text - Plaintext formatted content of the autoreply message.
     * @param {string} autoReplyData.html - HTML formatted content of the autoreply message.
     * @param {string|boolean} autoReplyData.start - Datestring of when the autoreply starts or false to disable start checks.
     * @param {string|boolean} autoReplyData.end - Datestring of when the autoreply ends or false to disable end checks.
     * @param {string} [autoReplyData.sess] - Optional session identifier for the logs.
     * @param {string} [autoReplyData.ip] - Optional IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the response object.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.id - The Autoreply ID.
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * // Update autoreply information for a user
     * const autoReplyData = {
     *   status: true,
     *   name: "John Doe",
     *   subject: "Out of Office",
     *   text: "I am currently out of office.",
     *   html: "<p>I am currently out of office.</p>",
     *   start: "2023-08-01T00:00:00Z",
     *   end: "2023-08-15T00:00:00Z",
     *   sess: "sess123",
     *   ip: "192.168.0.1"
     * };
     * const result = await autoreplies.updateAutoReply("507f1f77bcf86cd799439011", autoReplyData);
     * console.log(result.success); // true
     * console.log(result.id); // Autoreply ID
     */
    public async updateAutoReply(
        user: string,
        autoReplyData: {
            status: boolean;
            name: string;
            subject: string;
            text: string;
            html: string;
            start: string | boolean;
            end: string | boolean;
            sess?: string;
            ip?: string;
        }
    ): Promise<{ success: boolean; id: string }> {
        return this.client.put(`/users/${user}/autoreply`, autoReplyData);
    }

    /**
     * Remove Autoreply Information.
     *
     * This method deletes the autoreply information for a specific user from the Wildduck API.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {Object} [params] - Optional query parameters for logging.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the response object.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     *
     * @example
     * // Remove autoreply information for a user
     * const result = await autoreplies.removeAutoreply("507f1f77bcf86cd799439011", {
     *   sess: "sess123",
     *   ip: "192.168.0.1"
     * });
     * console.log(result.success); // true
     */
    public async removeAutoreply(
        user: string,
        params?: { sess?: string; ip?: string }
    ): Promise<{ success: boolean }> {
        const queryParams = params
            ? new URLSearchParams(params as Record<string, string>).toString()
            : "";
        const query = queryParams ? `?${queryParams}` : "";
        return this.client.delete(`/users/${user}/autoreply${query}`);
    }
}

