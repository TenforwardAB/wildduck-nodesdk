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
 * Created on 11/29/24 :: 5:21PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: Users.ts is part of the wildduck-nodesdk.
 */

/**
 * @module Users
 * @description Handles user-related operations within the WildDuck API.
 */

import {ApiClient} from "../utils/ApiClient";

/**
 * A class for handling user-related operations in the WildDuck API.
 * Provides methods for managing users, including listing, creating, updating,
 * deleting users, and handling advanced features such as quota recalculation,
 * password resets, and event streams.
 *
 * @class Users
 */
export class Users {
    private client: ApiClient;

    /**
     * Creates an instance of the Users class.
     * @private
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Fetch a list of registered users.
     *
     * This method allows filtering users with various parameters and retrieves a paginated list of users.
     *
     * @async
     * @function listUsers
     * @param {Object} [params] - Query parameters for filtering users.
     * @param {string} [params.query] - Partial match of username or default email address.
     * @param {string} [params.forward] - Partial match of a forward email address or URL.
     * @param {string} [params.tags] - Comma-separated list of tags. The user must have at least one of these tags.
     * @param {string} [params.requiredTags] - Comma-separated list of tags. The user must have all these tags.
     * @param {boolean} [params.metaData] - If `true`, includes metadata in the response.
     * @param {boolean} [params.internalData] - If `true`, includes internal data in the response (not shown for user-role tokens).
     * @param {number} [params.limit] - Number of records to return.
     * @param {string} [params.next] - Cursor value for the next page, retrieved from `nextCursor` in the response.
     * @param {string} [params.previous] - Cursor value for the previous page, retrieved from `previousCursor` in the response.
     * @param {number} [params.page] - Current page number (informational only, pages start from 1).
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves to a paginated list of users.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {number} return.total - Total number of results found.
     * @returns {number} return.page - Current page number (derived from the query argument).
     * @returns {string | boolean} return.previousCursor - Cursor for the previous page or `false` if no previous results exist.
     * @returns {string | boolean} return.nextCursor - Cursor for the next page or `false` if no next results exist.
     * @returns {string} return.query - Partial match of username or default email address used in the query.
     * @returns {Array<Object>} return.results - List of users matching the query parameters.
     * @returns {string} return.results[].id - User's unique ID (24-byte hex).
     * @returns {string} return.results[].username - Username of the user.
     * @returns {string} return.results[].name - Name of the user.
     * @returns {string} return.results[].address - Main email address of the user.
     * @returns {Array<string>} return.results[].tags - List of tags associated with the user.
     * @returns {Array<string>} return.results[].targets - List of forwarding targets.
     * @returns {Array<string>} return.results[].enabled2fa - List of enabled 2FA methods.
     * @returns {boolean} return.results[].autoreply - Whether autoreply is enabled.
     * @returns {boolean} return.results[].encryptMessages - Whether received messages are encrypted.
     * @returns {boolean} return.results[].encryptForwarded - Whether forwarded messages are encrypted.
     * @returns {Object} return.results[].quota - Quota usage limits for the user.
     * @returns {number} return.results[].quota.allowed - Allowed quota in bytes.
     * @returns {number} return.results[].quota.used - Space used in bytes.
     * @returns {Object} [return.results[].metaData] - Custom metadata value (if `metaData` was `true` in the query).
     * @returns {Object} [return.results[].internalData] - Internal metadata (if `internalData` was `true` and user-role token was not used).
     * @returns {boolean} return.results[].hasPasswordSet - Whether the user has a password set and can authenticate.
     * @returns {boolean} return.results[].activated - Whether the account is activated.
     * @returns {boolean} return.results[].disabled - Whether the user cannot authenticate or receive mail.
     * @returns {boolean} return.results[].suspended - Whether the user is suspended and cannot authenticate.
     *
     * @example
     * // Fetch users with a specific tag
     * const users = await users.listUsers({ tags: "admin" });
     * console.log(users.results); // Array of user objects
     *
     * @example
     * // Fetch the next page of results
     * const users = await users.listUsers({ next: "eyIkb2lkIjoiNWRmMWZkMmQ3NzkyNTExOGI2MDdjNjg0In0" });
     * console.log(users.nextCursor); // Cursor for the next page
     *
     * @example
     * // Fetch users with metadata included
     * const users = await users.listUsers({ metaData: true });
     * console.log(users.results[0].metaData); // Metadata for the first user
     *
     * @example
     * // Fetch users with a query string
     * const users = await users.listUsers({ query: "example" });
     * console.log(users.results.map(user => user.username)); // List of usernames matching the query
     */
    public async listUsers(params?: {
        query?: string;
        forward?: string;
        tags?: string;
        requiredTags?: string;
        metaData?: boolean;
        internalData?: boolean;
        limit?: number;
        next?: string;
        previous?: string;
        page?: number;
        sess?: string;
        ip?: string;
    }): Promise<{
        success: boolean;
        total: number;
        page: number;
        previousCursor: string | boolean;
        nextCursor: string | boolean;
        query: string;
        results: Array<{
            id: string;
            username: string;
            name: string;
            address: string;
            tags: string[];
            targets: string[];
            enabled2fa: string[];
            autoreply: boolean;
            encryptMessages: boolean;
            encryptForwarded: boolean;
            quota: { allowed: number; used: number };
            metaData?: object;
            internalData?: object;
            hasPasswordSet: boolean;
            activated: boolean;
            disabled: boolean;
            suspended: boolean;
        }>;
    }> {
        const query = new URLSearchParams(
            params as Record<string, string>
        ).toString();
        return this.client.get(`/users${query ? `?${query}` : ""}`);
    }


    /**
     * Create a new user.
     *
     * This method creates a new user with the specified attributes.
     * Most parameters are optional, but `username` and `password` are required.
     *
     * @param {Object} userData - The data for the new user.
     * @param {string} userData.username - **Required.** Username of the user. Dots are allowed but are informational only ("user.name" is treated the same as "username").
     * @param {string | boolean} userData.password - **Required.** Password for the account. Set to `false` to disable password usage for the master scope.
     * @param {boolean} [userData.hashedPassword] - If `true`, the password is already hashed. Supported hashes: `pbkdf2`, `bcrypt`, `md5`, `sha512`, `sha256`, `argon2`.
     * @param {boolean} [userData.allowUnsafe] - If `false`, validates the password against the "Have I Been Pwned" API.
     * @param {string} [userData.address] - Default email address for the user. Autogenerated if not set.
     * @param {boolean} [userData.emptyAddress] - If `true`, no email address will be autogenerated for the user.
     * @param {string} [userData.language] - Language code for the user.
     * @param {number} [userData.retention] - Default retention time in milliseconds. Set to `0` to disable.
     * @param {string} [userData.name] - Name of the user.
     * @param {Array<string>} [userData.targets] - Array of forwarding targets. Values can be email addresses, relay URLs, or POST URLs.
     * @param {number} [userData.spamLevel] - Spam detection scale (0 means everything is spam; 100 means nothing is spam).
     * @param {number} [userData.quota] - Allowed quota of the user in bytes.
     * @param {number} [userData.recipients] - Number of messages the user can send in 24 hours.
     * @param {number} [userData.forwards] - Number of messages the user can forward in 24 hours.
     * @param {number} [userData.filters] - Number of filters allowed for this account.
     * @param {boolean} [userData.requirePasswordChange] - If `true`, requires the user to change the password on first login.
     * @param {number} [userData.imapMaxUpload] - Max bytes uploadable via IMAP in 24 hours.
     * @param {number} [userData.imapMaxDownload] - Max bytes downloadable via IMAP in 24 hours.
     * @param {number} [userData.pop3MaxDownload] - Max bytes downloadable via POP3 in 24 hours.
     * @param {number} [userData.pop3MaxMessages] - Max number of messages listable in a POP3 session.
     * @param {number} [userData.imapMaxConnections] - Max parallel IMAP connections allowed.
     * @param {number} [userData.receivedMax] - Max messages received from MX in 60 seconds.
     * @param {Array<string>} [userData.fromWhitelist] - Additional email addresses the user can send mail from (wildcards allowed).
     * @param {Array<string>} [userData.tags] - Tags associated with this user.
     * @param {boolean} [userData.addTagsToAddress] - If `true`, autogenerated addresses inherit the user’s tags.
     * @param {boolean} [userData.uploadSentMessages] - If `true`, all messages sent via MSA are also uploaded to the Sent Mail folder.
     * @param {Object} [userData.mailboxes] - Optional names for special mailboxes (e.g., `sent`, `trash`, `junk`, `drafts`).
     * @param {Array<string>} [userData.disabledScopes] - List of disabled scopes (e.g., `"imap"`, `"pop3"`, `"smtp"`).
     * @param {Object} [userData.metaData] - Optional metadata (must be an object or a JSON string).
     * @param {Object} [userData.internalData] - Optional internal metadata for internal use (must be an object or a JSON string).
     * @param {string} [userData.pubKey] - Public PGP key for the user (use empty string to remove the key).
     * @param {boolean} [userData.encryptMessages] - If `true`, incoming messages are encrypted.
     * @param {boolean} [userData.encryptForwarded] - If `true`, forwarded messages are encrypted.
     * @param {Object} [userData.featureFlags] - Feature flags to specify (e.g., indexing).
     * @param {string} [userData.sess] - Session identifier for the logs.
     * @param {string} [userData.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with the user's unique ID.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.id - The resolved user's unique ID (24-byte hex).
     *
     * @example
     * // Create a simple user
     * const newUser = await users.createUser({
     *   username: "johndoe",
     *   password: "securePassword123",
     *   name: "John Doe",
     *   quota: 1073741824 // 1 GB
     * });
     *
     * @example
     * // Create a user with advanced settings
     * const advancedUser = await users.createUser({
     *   username: "janedoe",
     *   password: "securePassword123",
     *   hashedPassword: true,
     *   address: "jane@example.com",
     *   tags: ["admin", "support"],
     *   spamLevel: 80,
     *   metaData: { department: "IT" }
     * });
     */
    async createUser(userData: {
        username: string;
        password: string | boolean;
        hashedPassword?: boolean;
        allowUnsafe?: boolean;
        address?: string;
        emptyAddress?: boolean;
        language?: string;
        retention?: number;
        name?: string;
        targets?: string[];
        spamLevel?: number;
        quota?: number;
        recipients?: number;
        forwards?: number;
        filters?: number;
        requirePasswordChange?: boolean;
        imapMaxUpload?: number;
        imapMaxDownload?: number;
        pop3MaxDownload?: number;
        pop3MaxMessages?: number;
        imapMaxConnections?: number;
        receivedMax?: number;
        fromWhitelist?: string[];
        tags?: string[];
        addTagsToAddress?: boolean;
        uploadSentMessages?: boolean;
        mailboxes?: Record<string, string>;
        disabledScopes?: string[];
        metaData?: Record<string, any>;
        internalData?: Record<string, any>;
        pubKey?: string;
        encryptMessages?: boolean;
        encryptForwarded?: boolean;
        featureFlags?: Record<string, boolean>;
        sess?: string;
        ip?: string;
    }): Promise<any> {
        return this.client.post("/users", userData);
    }


    /**
     * Resolve a user ID by username.
     *
     * This method retrieves the unique ID of a user by their username.
     * The username must be alphanumeric and start with a letter.
     * Dots in the username are allowed but are treated as informational only.
     *
     * @param {string} username - **Required.** The username to resolve.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with the user's unique ID.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.id - The resolved user's unique ID (24-byte hex).
     *
     * @example
     * // Resolve a user's ID by their username
     * const userId = await users.resolveUser("johndoe");
     *
     * @example
     * // Resolve a user's ID with session and IP logging
     * const userId = await users.resolveUser("johndoe", { sess: "abc123", ip: "192.168.0.1" });
     */

    async resolveUser(username: string, params?: { sess?: string; ip?: string }): Promise<any> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
        return this.client.get(`/users/resolve/${username}${query}`);
    }


    /**
     * Fetch information about a specific user.
     *
     * This method retrieves detailed information about a user by their unique ID, including metadata, limits, and account settings.
     *
     * @async
     * @function getUser
     * @param {string} userId - **Required.** The user's unique ID.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with detailed user information.
     * @returns {boolean} return.success - Indicates successful response.
     * @returns {string} return.id - The user's unique ID (24-byte hex).
     * @returns {string} return.username - Username of the user.
     * @returns {string} return.name - Name of the user.
     * @returns {string} return.address - Main email address of the user.
     * @returns {number} return.retention - Default retention time (in ms). Returns `false` if not enabled.
     * @returns {string[]} return.enabled2fa - List of enabled 2FA methods.
     * @returns {boolean} return.autoreply - Whether autoreply is enabled (may depend on start or end time).
     * @returns {boolean} return.encryptMessages - Whether received messages are encrypted.
     * @returns {boolean} return.encryptForwarded - Whether forwarded messages are encrypted.
     * @returns {string} return.pubKey - Public PGP key for the user used for encryption.
     * @returns {Object} return.keyInfo - Information about the public key or `false` if no key is available.
     * @returns {Object} return.metaData - Custom metadata object set for this user.
     * @returns {Object} return.internalData - Internal metadata object for this user. Not available for user-role tokens.
     * @returns {string[]} return.targets - List of forwarding targets (e.g., email addresses or relay URLs).
     * @returns {number} return.spamLevel - Spam detection level (0 = everything is spam, 100 = nothing is spam).
     * @returns {Object} return.limits - Account limits and usage (e.g., quota, recipients, filters, etc.).
     * @returns {string[]} return.tags - List of tags associated with this user.
     * @returns {string[]} return.fromWhitelist - List of additional email addresses the user can send mail from. Wildcards allowed.
     * @returns {string[]} return.disabledScopes - Disabled scopes for this user (e.g., `"imap"`, `"pop3"`, `"smtp"`).
     * @returns {boolean} return.hasPasswordSet - Whether the user has a password set and can authenticate.
     * @returns {boolean} return.activated - Whether the account is activated.
     * @returns {boolean} return.disabled - Whether the user cannot authenticate or receive mail.
     * @returns {boolean} return.suspended - Whether the user is suspended and cannot authenticate.
     *
     * @example
     * // Fetch user information by ID
     * const userInfo = await users.getUser("507f1f77bcf86cd799439011");
     *
     * @example
     * // Fetch user information with session and IP logging
     * const userInfo = await users.getUser("507f1f77bcf86cd799439011", { sess: "abc123", ip: "192.168.0.1" });
     */

    async getUser(userId: string, params?: { sess?: string; ip?: string }): Promise<any> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
        return this.client.get(`/users/${userId}${query}`);
    }


    /**
     * Update user information.
     *
     * This method updates details for a specific user by their unique ID.
     * Most parameters are optional and allow partial updates of the user's profile and settings.
     *
     * @param {string} userId - **Required.** The user's unique ID.
     * @param {Object} updates - The data to update for the user.
     * @param {string} [updates.existingPassword] - If provided, validates against the user's current password before applying changes.
     * @param {string | boolean} [updates.password] - New password for the account. Set to `false` to disable password usage for the master scope.
     * @param {boolean} [updates.hashedPassword] - If `true`, the password is already hashed (e.g., `pbkdf2`, `bcrypt`, `md5`, etc.).
     * @param {boolean} [updates.allowUnsafe] - If `false`, validates the password against the "Have I Been Pwned" API.
     * @param {string} [updates.language] - Language code for the user.
     * @param {string} [updates.name] - Name of the user.
     * @param {Array<string>} [updates.targets] - An array of forwarding targets (email addresses, relay URLs, or POST URLs).
     * @param {number} [updates.spamLevel] - Relative spam detection level (0 = everything is spam, 100 = nothing is spam).
     * @param {boolean} [updates.uploadSentMessages] - If `true`, all messages sent via MSA are uploaded to the Sent Mail folder.
     * @param {Array<string>} [updates.fromWhitelist] - Additional email addresses this user can send mail from (wildcards allowed).
     * @param {Object} [updates.metaData] - Optional custom metadata as an object or JSON string.
     * @param {Object} [updates.internalData] - Optional internal metadata as an object or JSON string (not available for user-role tokens).
     * @param {string} [updates.pubKey] - Public PGP key for the user (set to an empty string to remove the key).
     * @param {boolean} [updates.encryptMessages] - If `true`, incoming messages are encrypted.
     * @param {boolean} [updates.encryptForwarded] - If `true`, forwarded messages are encrypted.
     * @param {number} [updates.retention] - Default retention time in milliseconds (set to `0` to disable).
     * @param {number} [updates.quota] - Allowed storage quota for the user in bytes.
     * @param {number} [updates.recipients] - Number of messages the user can send in 24 hours.
     * @param {number} [updates.forwards] - Number of messages the user can forward in 24 hours.
     * @param {number} [updates.filters] - Number of filters allowed for the user.
     * @param {number} [updates.imapMaxUpload] - Maximum upload limit via IMAP in 24 hours (bytes).
     * @param {number} [updates.imapMaxDownload] - Maximum download limit via IMAP in 24 hours (bytes).
     * @param {number} [updates.pop3MaxDownload] - Maximum download limit via POP3 in 24 hours (bytes).
     * @param {number} [updates.pop3MaxMessages] - Maximum number of messages retrievable in a POP3 session.
     * @param {number} [updates.imapMaxConnections] - Maximum number of parallel IMAP connections allowed.
     * @param {number} [updates.receivedMax] - Maximum messages received from MX in 60 seconds.
     * @param {boolean} [updates.disable2fa] - If `true`, disables two-factor authentication for the user.
     * @param {Array<string>} [updates.tags] - Tags associated with the user.
     * @param {Array<string>} [updates.disabledScopes] - Scopes disabled for the user (`"imap"`, `"pop3"`, `"smtp"`).
     * @param {boolean} [updates.disabled] - If `true`, disables the user account (user cannot log in or receive messages).
     * @param {boolean} [updates.suspended] - If `true`, disables authentication for the user.
     * @param {Object} [updates.featureFlags] - Feature flags to enable for the user.
     * @param {string} [updates.sess] - Session identifier for the logs.
     * @param {string} [updates.ip] - IP address for the logs.
     *
     * @returns {Promise<any>} Success status indicating whether the update was successful.
     *
     * @example
     * // Update a user's name and language
     * const result = await users.updateUser("507f1f77bcf86cd799439011", {
     *   name: "John Doe",
     *   language: "en"
     * });
     *
     * @example
     * // Disable a user account
     * const result = await users.updateUser("507f1f77bcf86cd799439011", {
     *   disabled: true
     * });
     */
    async updateUser(
        userId: string,
        updates: {
            existingPassword?: string;
            password?: string | boolean;
            hashedPassword?: boolean;
            allowUnsafe?: boolean;
            language?: string;
            name?: string;
            targets?: string[];
            spamLevel?: number;
            uploadSentMessages?: boolean;
            fromWhitelist?: string[];
            metaData?: Record<string, any>;
            internalData?: Record<string, any>;
            pubKey?: string;
            encryptMessages?: boolean;
            encryptForwarded?: boolean;
            retention?: number;
            quota?: number;
            recipients?: number;
            forwards?: number;
            filters?: number;
            imapMaxUpload?: number;
            imapMaxDownload?: number;
            pop3MaxDownload?: number;
            pop3MaxMessages?: number;
            imapMaxConnections?: number;
            receivedMax?: number;
            disable2fa?: boolean;
            tags?: string[];
            disabledScopes?: string[];
            disabled?: boolean;
            suspended?: boolean;
            featureFlags?: Record<string, boolean>;
            sess?: string;
            ip?: string;
        }
    ): Promise<any> {
        return this.client.put(`/users/${userId}`, updates);
    }

    /**
     * Delete a user.
     *
     * This method deletes a user and their address entries from the database. It schedules a background task to delete messages.
     * If the user has already been deleted, the method can still be called to address any pending messages.
     *
     * @param {string} userId - **Required.** The unique ID of the user to delete.
     * @param {Object} [params] - Optional query parameters for deletion behavior.
     * @param {string} [params.deleteAfter] - A date-time string. If set, keeps all user data until the specified date. The user account is fully recoverable up to that date.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with the deletion task details.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.code - Task code, typically `TaskScheduled`.
     * @returns {string} return.user - The user ID of the deleted user.
     * @returns {Object} return.addresses - Address deletion details.
     * @returns {string} [return.addresses.deleteAfter] - The date after which the user data will be deleted.
     * @returns {string} return.task - The ID of the scheduled deletion task.
     *
     * @example
     * // Delete a user immediately
     * const result = await users.deleteUser("507f1f77bcf86cd799439011");
     *
     * @example
     * // Schedule user deletion with a delay
     * const result = await users.deleteUser("507f1f77bcf86cd799439011", { deleteAfter: "2024-12-31T23:59:59Z" });
     *
     * @example
     * // Delete a user with session and IP logging
     * const result = await users.deleteUser("507f1f77bcf86cd799439011", { sess: "abc123", ip: "192.168.0.1" });
     */
    async deleteUser(
        userId: string,
        params?: { deleteAfter?: string; sess?: string; ip?: string }
    ): Promise<any> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
        return this.client.delete(`/users/${userId}${query}`);
    }


    /**
     * Log out a user.
     *
     * This method logs out a specific user by invalidating their current session.
     * A message can optionally be provided to inform connected IMAP clients about the logout.
     *
     * @param {string} userId - **Required.** The unique ID of the user to log out.
     * @param {Object} data - Additional information for the logout request.
     * @param {string} [data.reason] - A message to display to connected IMAP clients.
     * @param {string} [data.sess] - Session identifier for the logs.
     * @param {string} [data.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with the success status of the operation.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     *
     * @example
     * // Log out a user with a reason
     * const result = await users.logoutUser("507f1f77bcf86cd799439011", { reason: "Session terminated by admin" });
     *
     * @example
     * // Log out a user with session and IP logging
     * const result = await users.logoutUser("507f1f77bcf86cd799439011", { sess: "abc123", ip: "192.168.0.1" });
     */
    async logoutUser(
        userId: string,
        data: { reason?: string; sess?: string; ip?: string }
    ): Promise<any> {
        return this.client.put(`/users/${userId}/logout`, data);
    }


    /**
     * Recalculate quota for a specific user or the current user if no userId is provided.
     *
     * This method recalculates the quota usage for a specific user. It is typically used if quota numbers are inaccurate.
     * Note that this method is not transactional, so the resulting value may not be exact if the user is actively receiving messages.
     *
     * @param {string} [userId] - The unique ID of the user whose quota should be recalculated. Defaults to `me` if not provided.
     * @param {Object} [data] - Optional data for the request body.
     * @param {string} [data.sess] - Session identifier for the logs.
     * @param {string} [data.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with quota recalculation details.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {number} return.storageUsed - The recalculated quota usage for the user (in bytes).
     * @returns {number} return.previousStorageUsed - The previous quota usage before recalculation (in bytes).
     *
     * @example
     * // Recalculate quota for a specific user
     * const quotaDetails = await users.recalculateUserQuota("507f1f77bcf86cd799439011");
     *
     * @example
     * // Recalculate quota for the current user with session and IP logging
     * const quotaDetails = await users.recalculateUserQuota(undefined, { sess: "abc123", ip: "192.168.0.1" });
     */
    async recalculateUserQuota(
        userId?: string,
        data?: { sess?: string; ip?: string }
    ): Promise<any> {
        const targetUser = userId || "me";
        return this.client.post(`/users/${targetUser}/quota/reset`, data || {});
    }

    /**
     * Recalculate quota usage for all users.
     *
     * This method recalculates quota usage for all users. It is typically used if quota numbers are inaccurate across the system.
     * Note that this method is not transactional, so the resulting values may not be exact if users are actively receiving messages.
     *
     * @param {Object} [data] - Optional data for the request body.
     * @param {string} [data.sess] - Session identifier for the logs.
     * @param {string} [data.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with details of the recalculation task.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.task - The ID of the scheduled recalculation task.
     *
     * @example
     * // Recalculate quota for all users
     * const result = await users.recalculateAllUsersQuota();
     *
     * @example
     * // Recalculate quota with session and IP logging
     * const result = await users.recalculateAllUsersQuota({ sess: "abc123", ip: "192.168.0.1" });
     */
    async recalculateAllUsersQuota(
        data?: { sess?: string; ip?: string }
    ): Promise<any> {
        return this.client.post("/quota/reset", data || {});
    }


    /**
     * Reset a user's password.
     *
     * This method generates a new temporary password for a user and removes all two-factor authentication settings.
     * If the `userId` is `"me"`, the reset applies to the currently authenticated user, provided they have their own generated token.
     *
     * @param {string} userId - **Required.** The unique ID of the user whose password should be reset. Defaults to `"me"` if not provided.
     * @param {Object} [data] - Optional request body parameters.
     * @param {string} [data.validAfter] - A date-time string. If provided, the generated password will only be usable after this time.
     * @param {string} [data.sess] - Session identifier for the logs.
     * @param {string} [data.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with the new temporary password details.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.password - The new temporary password.
     * @returns {string} [return.validAfter] - The date after which the password becomes valid (if provided).
     *
     * @example
     * // Reset a specific user's password
     * const result = await users.resetPassword("507f1f77bcf86cd799439011");
     *
     * @example
     * // Reset the current user's password with logging
     * const result = await users.resetPassword("me", { sess: "abc123", ip: "192.168.0.1" });
     *
     * @example
     * // Reset a user's password with a valid-after date
     * const result = await users.resetPassword("507f1f77bcf86cd799439011", { validAfter: "2024-12-31T23:59:59Z" });
     */
    async resetPassword(
        userId: string,
        data?: { validAfter?: string; sess?: string; ip?: string }
    ): Promise<any> {
        const targetUser = userId || "me";
        return this.client.post(`/users/${targetUser}/password/reset`, data || {});
    }

    /**
     * Get recovery information for a deleted user.
     *
     * This method retrieves recovery details for a deleted user, including their ID, username, storage usage, tags,
     * deletion date, and recoverable addresses.
     *
     * @param {string} userId - **Required.** The unique ID of the deleted user to retrieve recovery information for.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with the recovery details.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.user - The unique ID of the deleted user.
     * @returns {string} return.username - The username of the deleted user.
     * @returns {number} return.storageUsed - The calculated storage usage of the deleted user (in bytes).
     * @returns {Array<string>} return.tags - A list of tags associated with the deleted user.
     * @returns {string} return.deleted - The date-time string indicating when the user was deleted.
     * @returns {Array<string>} return.recoverableAddresses - A list of email addresses that can be restored for the user.
     *
     * @example
     * // Retrieve recovery information for a deleted user
     * const recoveryInfo = await users.getRecoveryInfo("507f1f77bcf86cd799439011");
     *
     * @example
     * // Retrieve recovery information with session and IP logging
     * const recoveryInfo = await users.getRecoveryInfo("507f1f77bcf86cd799439011", { sess: "abc123", ip: "192.168.0.1" });
     */
    async getRecoveryInfo(
        userId: string,
        params?: { sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        user: string;
        username: string;
        storageUsed: number;
        tags: string[];
        deleted: string;
        recoverableAddresses: string[];
    }> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
        return this.client.get(`/users/${userId}/restore${query}`);
    }


    /**
     * Cancel deletion for a user.
     *
     * This method cancels a timed deletion task for a user that was scheduled via a DELETE request.
     * If the user data has not yet been deleted, the account is fully recovered except for any email addresses that might have already been recycled.
     *
     * @param {string} userId - **Required.** The unique ID of the user whose deletion task should be canceled.
     * @param {Object} data - Session details for the cancellation request.
     * @param {string} [data.sess] - Session identifier for the logs.
     * @param {string} [data.ip] - IP address for the logs.
     *
     * @returns {Promise<Object>} A promise that resolves with the status of the cancellation task.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.code - The task status code.
     * @returns {string} return.user - The unique ID of the user.
     * @returns {string} return.task - The existing task ID for the deletion operation.
     * @returns {Object} return.addresses - Details about the recovered addresses.
     * @returns {number} return.addresses.recovered - The number of recovered addresses.
     * @returns {string} return.addresses.main - The main address of the user.
     *
     * @example
     * // Cancel deletion for a user
     * const result = await users.cancelDeletion("507f1f77bcf86cd799439011", { sess: "abc123", ip: "192.168.0.1" });
     *
     * @example
     * // Cancel deletion with only session information
     * const result = await users.cancelDeletion("507f1f77bcf86cd799439011", { sess: "xyz789" });
     */
    async cancelDeletion(
        userId: string,
        data: { sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        code: string;
        user: string;
        task: string;
        addresses: {
            recovered: number;
            main: string;
        };
    }> {
        return this.client.post(`/users/${userId}/restore`, data);
    }

    /**
     * Open a change stream for a specific user.
     *
     * This method establishes a real-time EventSource connection to listen for updates on changes in messages and mailboxes.
     * Events returned are JSON-encoded strings.
     *
     * @param {string} userId - **Required.** The unique ID of the user to monitor for updates.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.LastEventID] - The ID of the last event received, to resume the stream from that point.
     * @param {string} [params.sess] - Session identifier for the logs.
     * @param {string} [params.ip] - IP address for the logs.
     *
     * @returns {EventSource} An EventSource object streaming updates for the user.
     *
     * @example
     * // Open a change stream for a user
     * const eventSource = users.openChangeStream("507f1f77bcf86cd799439011");
     *
     * eventSource.onmessage = (event) => {
     *   console.log("New event:", JSON.parse(event.data));
     * };
     *
     * eventSource.onerror = (error) => {
     *   console.error("Error in event stream:", error);
     *   eventSource.close();
     * };
     *
     * @example
     * // Open a change stream with session and IP logging
     * const eventSource = users.openChangeStream("507f1f77bcf86cd799439011", { sess: "abc123", ip: "192.168.0.1" });
     *
     * eventSource.onmessage = (event) => {
     *   console.log("Received event:", JSON.parse(event.data));
     * };
     */
    openChangeStream(
        userId: string,
        params?: { LastEventID?: string; sess?: string; ip?: string }
    ): EventSource {
        const endpoint = `/users/${userId}/updates`;
        return this.client.stream(endpoint, params);
    }


}

