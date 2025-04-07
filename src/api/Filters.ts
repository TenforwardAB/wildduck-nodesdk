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
 * Created on 4/7/25 :: 3:12PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Filters.ts is part of the wildduck-nodesdk project.
 */

import { ApiClient } from "../utils/ApiClient";

export class Filters {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Filters class.
     *
     * @constructor
     * @private
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * List all Filters.
     *
     * This method retrieves a list of filters from the Wildduck API, optionally filtering based on a partial match
     * for a forward email, including metaData, and supporting pagination and logging.
     *
     * @param {Object} [params] - Query parameters for filtering the filters.
     * @param {string} [params.forward] - Partial match of a forward email address or URL.
     * @param {boolean} [params.metaData] - If true, includes metaData in the response.
     * @param {number} [params.limit] - Number of records to return (default: 20).
     * @param {string} [params.next] - Cursor value for the next page.
     * @param {string} [params.previous] - Cursor value for the previous page.
     * @param {number} [params.page] - Current page number (default: 1).
     * @param {string} [params.sess] - Session identifier for logging.
     * @param {string} [params.ip] - IP address for logging.
     * @returns {Promise<object>} A promise that resolves to the filters list.
     *
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {number} return.total - Total number of filters found.
     * @returns {number} return.page - Current page number.
     * @returns {object} return.previousCursor - Either a cursor string or false if there are no previous results.
     * @returns {object} return.nextCursor - Either a cursor string or false if there are no next results.
     * @returns {Array<Object>} return.results - List of filters with detailed information.
     * @returns {string} return.results[].id - The unique ID of the filter.
     * @returns {string} return.results[].user - The user ID associated with the filter.
     * @returns {string} return.results[].name - The name of the filter.
     * @returns {string} return.results[].created - The creation date of the filter (ISO date string).
     * @returns {Array<any>} return.results[].query - Array of query strings for the filter.
     * @returns {Array<any>} return.results[].action - Array of action strings for the filter.
     * @returns {boolean} return.results[].disabled - Indicates whether the filter is disabled.
     * @returns {object} [return.results[].metaData] - Custom metadata value (included if metaData parameter is true).
     * @returns {Array<string>} [return.results[].targets] - List of forwarding targets.
     *
     * @example
     * // Fetch all filters
     * const filters = await filters.listAllFilters();
     *
     * @example
     * // Fetch filters with metaData included and a limit of 50 records
     * const filters = await filters.listAllFilters({
     *   metaData: true,
     *   limit: 50,
     * });
     */
    public async listAllFilters(
        params?: {
            forward?: string;
            metaData?: boolean;
            limit?: number;
            next?: string;
            previous?: string;
            page?: number;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        total: number;
        page: number;
        previousCursor: any;
        nextCursor: any;
        results: Array<{
            id: string;
            user: string;
            name: string;
            created: string;
            query: Array<any>;
            action: Array<any>;
            disabled: boolean;
            metaData?: any;
            targets?: string[];
        }>;
    }> {
        const queryParams = params
            ? Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
            : {};
        const query = Object.keys(queryParams).length ? `?${new URLSearchParams(queryParams).toString()}` : "";
        return this.client.get(`/filters${query}`);
    }

    /**
     * List Filters for a User.
     *
     * This method retrieves a list of filters for a specific user from the Wildduck API.
     * It requires the user's ID as a path parameter and accepts optional query parameters for including metaData
     * and logging details such as session and IP address.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {Object} [params] - Query parameters for filtering the filters.
     * @param {boolean} [params.metaData] - If true, includes metaData in the response.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the user's filters list.
     *
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {object} return.limits - Filter usage limits for the user account.
     * @returns {number} return.limits.allowed - The total number of filters allowed.
     * @returns {number} return.limits.used - The number of filters that have been created.
     * @returns {Array<Object>} return.results - List of filters with detailed information.
     * @returns {string} return.results[].id - The unique ID of the filter.
     * @returns {string} return.results[].name - The name of the filter.
     * @returns {string} return.results[].created - The creation date of the filter (ISO date string).
     * @returns {Array<any>} return.results[].query - Array of query strings for the filter.
     * @returns {Array<any>} return.results[].action - Array of action strings for the filter.
     * @returns {boolean} return.results[].disabled - Indicates whether the filter is disabled.
     * @returns {object} [return.results[].metaData] - Custom metadata value (included if metaData parameter is true).
     *
     * @example
     * // Fetch filters for a specific user
     * const userFilters = await filters.listUserFilters("507f1f77bcf86cd799439011");
     *
     * @example
     * // Fetch filters with metaData included for logging
     * const userFilters = await filters.listUserFilters("507f1f77bcf86cd799439011", {
     *   metaData: true,
     *   sess: "session123",
     *   ip: "192.168.1.1",
     * });
     */
    public async listUserFilters(
        user: string,
        params?: {
            metaData?: boolean;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        limits: {
            allowed: number;
            used: number;
        };
        results: Array<{
            id: string;
            name: string;
            created: string;
            query: Array<any>;
            action: Array<any>;
            disabled: boolean;
            metaData?: any;
        }>;
    }> {
        const queryParams = params
            ? Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
            : {};
        const query = Object.keys(queryParams).length ? `?${new URLSearchParams(queryParams).toString()}` : "";
        return this.client.get(`/users/${user}/filters${query}`);
    }

    /**
     * Create a new Filter.
     *
     * This method creates a new filter for a specific user in the Wildduck API.
     * It requires the user's ID as a path parameter and a filter data object in the request body.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {Object} filterData - The filter data for the new filter.
     * @param {string} filterData.name - Name of the filter.
     * @param {Object} filterData.query - Rules that a message must match.
     * @param {string} [filterData.query.from] - Partial match for the From: header (case insensitive).
     * @param {string} [filterData.query.to] - Partial match for the To:/Cc: headers (case insensitive).
     * @param {string} [filterData.query.subject] - Partial match for the Subject: header (case insensitive).
     * @param {string} [filterData.query.listId] - Partial match for the List-ID: header (case insensitive).
     * @param {string} [filterData.query.text] - Fulltext search against message text.
     * @param {boolean} [filterData.query.ha] - Indicates whether a message must have an attachment.
     * @param {number} [filterData.query.size] - Message size in bytes. A positive value means the message must be larger; a negative value means it must be smaller than the absolute value.
     * @param {Object} filterData.action - Action to take with a matching message.
     * @param {boolean} [filterData.action.seen] - If true, mark matching messages as Seen.
     * @param {boolean} [filterData.action.flag] - If true, mark matching messages as Flagged.
     * @param {boolean} [filterData.action.delete] - If true, do not store matching messages.
     * @param {boolean} [filterData.action.spam] - If true, store matching messages to the Junk Mail folder.
     * @param {string} [filterData.action.mailbox] - Mailbox ID to store matching messages.
     * @param {string[]} [filterData.action.targets] - An array of forwarding targets (email addresses, relay URLs, or POST URLs).
     * @param {boolean} [filterData.disabled=false] - If true, this filter is ignored.
     * @param {any} [filterData.metaData] - Optional metadata, must be an object or JSON formatted string.
     * @param {string} [filterData.sess] - Session identifier for the logs.
     * @param {string} [filterData.ip] - IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the response of the filter creation.
     *
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {Object} return.filter - The newly created filter details.
     * @returns {string} return.filter.id - The unique ID of the filter.
     * @returns {string} return.filter.name - The name of the filter.
     * @returns {string} return.filter.created - The creation date of the filter (ISO date string).
     * @returns {Object} return.filter.query - The filter query rules.
     * @returns {Object} return.filter.action - The actions to be taken for matching messages.
     * @returns {boolean} return.filter.disabled - Indicates if the filter is disabled.
     * @returns {any} [return.filter.metaData] - Custom metadata if provided.
     *
     * @example
     * // Create a new filter for a user
     * const newFilter = await filters.createFilter("507f1f77bcf86cd799439011", {
     *   name: "Important Emails",
     *   query: {
     *     from: "example@example.com",
     *     subject: "Invoice"
     *   },
     *   action: {
     *     seen: true,
     *     mailbox: "inbox"
     *   },
     *   disabled: false,
     *   metaData: { priority: "high" },
     *   sess: "session123",
     *   ip: "192.168.1.1"
     * });
     */
    public async createFilter(
        user: string,
        filterData: {
            name: string;
            query: {
                from?: string;
                to?: string;
                subject?: string;
                listId?: string;
                text?: string;
                ha?: boolean;
                size?: number;
            };
            action: {
                seen?: boolean;
                flag?: boolean;
                delete?: boolean;
                spam?: boolean;
                mailbox?: string;
                targets?: string[];
            };
            disabled?: boolean;
            metaData?: any;
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        filter: {
            id: string;
            name: string;
            created: string;
            query: any;
            action: any;
            disabled: boolean;
            metaData?: any;
        };
    }> {
        return this.client.post(`/users/${user}/filters`, filterData);
    }

    /**
     * Get Filter Information.
     *
     * This method retrieves detailed information for a specific filter associated with a user from the Wildduck API.
     * It requires both the user's ID and the filter's unique ID as path parameters. Optional query parameters for logging,
     * such as session identifier and IP address, can also be provided.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {string} filter - The unique ID of the filter.
     * @param {Object} [params] - Optional query parameters for logging.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the filter information.
     *
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.id - The unique ID of the filter.
     * @returns {string} return.name - The name of the filter.
     * @returns {string} return.created - The creation date of the filter (ISO date string).
     * @returns {object} return.query - The filter query rules.
     * @returns {string} [return.query.from] - Partial match for the From: header (case insensitive).
     * @returns {string} [return.query.to] - Partial match for the To:/Cc: headers (case insensitive).
     * @returns {string} [return.query.subject] - Partial match for the Subject: header (case insensitive).
     * @returns {string} [return.query.listId] - Partial match for the List-ID: header (case insensitive).
     * @returns {string} [return.query.text] - Fulltext search against message text.
     * @returns {boolean} [return.query.ha] - Indicates if a message must have an attachment.
     * @returns {number} [return.query.size] - Message size in bytes (positive for larger, negative for smaller than the absolute value).
     * @returns {object} return.action - Action to take with a matching message.
     * @returns {boolean} [return.action.seen] - If true, mark matching messages as Seen.
     * @returns {boolean} [return.action.flag] - If true, mark matching messages as Flagged.
     * @returns {boolean} [return.action.delete] - If true, do not store matching messages.
     * @returns {boolean} [return.action.spam] - If true, store matching messages to the Junk Mail folder.
     * @returns {string} [return.action.mailbox] - Mailbox ID to store matching messages.
     * @returns {string[]} [return.action.targets] - Array of forwarding targets.
     * @returns {boolean} return.disabled - Indicates if the filter is disabled.
     * @returns {object} return.metaData - Custom metadata value.
     *
     * @example
     * // Get filter information for a specific filter of a user
     * const filterInfo = await filters.getFilterInformation("507f1f77bcf86cd799439011", "filter123", {
     *   sess: "session123",
     *   ip: "192.168.1.1",
     * });
     */
    public async getFilterInformation(
        user: string,
        filter: string,
        params?: {
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
        id: string;
        name: string;
        created: string;
        query: {
            from?: string;
            to?: string;
            subject?: string;
            listId?: string;
            text?: string;
            ha?: boolean;
            size?: number;
        };
        action: {
            seen?: boolean;
            flag?: boolean;
            delete?: boolean;
            spam?: boolean;
            mailbox?: string;
            targets?: string[];
        };
        disabled: boolean;
        metaData: any;
    }> {
        const queryParams = params
            ? Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
            : {};
        const query = Object.keys(queryParams).length ? `?${new URLSearchParams(queryParams).toString()}` : "";
        return this.client.get(`/users/${user}/filters/${filter}${query}`);
    }

    /**
     * Delete a Filter.
     *
     * This method deletes a specific filter for a user from the Wildduck API.
     * It requires both the user's ID and the filter's unique ID as path parameters.
     * Optional query parameters for logging, such as session identifier and IP address, can also be provided.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {string} filter - The unique ID of the filter to be deleted.
     * @param {Object} [params] - Optional query parameters for logging.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the response of the filter deletion.
     *
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     *
     * @example
     * // Delete a filter for a user
     * const deleteResponse = await filters.deleteFilter("507f1f77bcf86cd799439011", "filter123", {
     *   sess: "session123",
     *   ip: "192.168.1.1",
     * });
     */
    public async deleteFilter(
        user: string,
        filter: string,
        params?: {
            sess?: string;
            ip?: string;
        }
    ): Promise<{
        success: boolean;
    }> {
        // Convert parameters to string values for URLSearchParams.
        const queryParams = params
            ? Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
            : {};
        const query = Object.keys(queryParams).length ? `?${new URLSearchParams(queryParams).toString()}` : "";
        return this.client.delete(`/users/${user}/filters/${filter}${query}`);
    }

    /**
     * Update Filter Information.
     *
     * This method updates an existing filter for a specific user in the Wildduck API.
     * It requires both the user's ID and the filter's unique ID as path parameters, and takes a filter data object in the request body.
     * Optional query parameters for logging, such as session identifier and IP address, can also be provided.
     *
     * @param {string} user - The user's ID. (Example: "507f1f77bcf86cd799439011")
     * @param {string} filter - The unique ID of the filter to update.
     * @param {Object} filterData - The updated filter data.
     * @param {string} filterData.name - Name of the filter.
     * @param {Object} filterData.query - Rules that a message must match.
     * @param {string} [filterData.query.from] - Partial match for the From: header (case insensitive).
     * @param {string} [filterData.query.to] - Partial match for the To:/Cc: headers (case insensitive).
     * @param {string} [filterData.query.subject] - Partial match for the Subject: header (case insensitive).
     * @param {string} [filterData.query.listId] - Partial match for the List-ID: header (case insensitive).
     * @param {string} [filterData.query.text] - Fulltext search against message text.
     * @param {boolean} [filterData.query.ha] - Indicates whether a message must have an attachment.
     * @param {number} [filterData.query.size] - Message size in bytes. Positive means the message needs to be larger, negative means smaller than the absolute value.
     * @param {Object} filterData.action - Action to take with a matching message.
     * @param {boolean} [filterData.action.seen] - If true, mark matching messages as Seen.
     * @param {boolean} [filterData.action.flag] - If true, mark matching messages as Flagged.
     * @param {boolean} [filterData.action.delete] - If true, do not store matching messages.
     * @param {boolean} [filterData.action.spam] - If true, store matching messages to the Junk Mail folder.
     * @param {string} [filterData.action.mailbox] - Mailbox ID to store matching messages.
     * @param {string[]} [filterData.action.targets] - Array of forwarding targets.
     * @param {boolean} filterData.disabled - If true, then this filter is ignored.
     * @param {any} [filterData.metaData] - Optional metadata, must be an object or JSON formatted string.
     * @param {string} [filterData.sess] - Session identifier for the logs.
     * @param {string} [filterData.ip] - IP address for the logs.
     * @returns {Promise<object>} A promise that resolves to the response of the filter update.
     *
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     *
     * @example
     * // Update filter information for a specific filter of a user
     * const updateResponse = await filters.updateFilter("507f1f77bcf86cd799439011", "filter123", {
     *   name: "Updated Filter Name",
     *   query: {
     *     from: "new@example.com",
     *     subject: "New Subject"
     *   },
     *   action: {
     *     seen: true,
     *     mailbox: "inbox"
     *   },
     *   disabled: false,
     *   metaData: { updated: true },
     *   sess: "session123",
     *   ip: "192.168.1.1"
     * });
     */
    public async updateFilter(
        user: string,
        filter: string,
        filterData: {
            name: string;
            query: {
                from?: string;
                to?: string;
                subject?: string;
                listId?: string;
                text?: string;
                ha?: boolean;
                size?: number;
            };
            action: {
                seen?: boolean;
                flag?: boolean;
                delete?: boolean;
                spam?: boolean;
                mailbox?: string;
                targets?: string[];
            };
            disabled: boolean;
            metaData?: any;
            sess?: string;
            ip?: string;
        }
    ): Promise<{ success: boolean }> {
        return this.client.put(`/users/${user}/filters/${filter}`, filterData);
    }

}
