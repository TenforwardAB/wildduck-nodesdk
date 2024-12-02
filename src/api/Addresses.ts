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
 * Created on 2024-12-02 :: 19:13 BY joyider <andre(-at-)sess.se>
 *
 * This file :: Addresses.ts is part of the wildduck-nodesdk.
 */

import {ApiClient} from "../utils/ApiClient";

/**
 * A class for handling address-related operations in the WildDuck API.
 * This class provides methods for listing, creating, and retrieving address details.
 *
 * @class Addresses
 */
export class Addresses {
    /**
     * @private
     * @property {ApiClient} client - The ApiClient instance used for making API requests.
     */
    private client: ApiClient;

    /**
     * Creates an instance of the Addresses class.
     *
     * @constructor
     * @private
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     *
     * @example
     * // Example instantiation of the Addresses class
     * const addresses = new Addresses(apiClient);
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * List all registered addresses.
     *
     * @async
     * @function listAddresses
     * @param {Object} [params] - Query parameters for filtering addresses.
     * @param {string} [params.query] - Partial match of an address.
     * @param {string} [params.forward] - Partial match of a forward email address or URL.
     * @param {string} [params.tags] - Comma-separated list of tags. Address must have at least one.
     * @param {string} [params.requiredTags] - Comma-separated list of tags. Address must have all.
     * @param {boolean} [params.metaData] - If true, includes metaData in the response.
     * @param {boolean} [params.internalData] - If true, includes internalData in the response.
     * @param {number} [params.limit] - Number of records to return.
     * @param {string} [params.next] - Cursor value for the next page.
     * @param {string} [params.previous] - Cursor value for the previous page.
     * @param {number} [params.page] - Current page number (informational only).
     * @param {string} [params.sess] - Session identifier for logs.
     * @param {string} [params.ip] - IP address for logs.
     * @returns {Promise<{
     *   success: boolean;
     *   query: string;
     *   total: number;
     *   page: number;
     *   previousCursor: string | boolean;
     *   nextCursor: string | boolean;
     *   results: Array<{
     *     id: string;
     *     name: string;
     *     address: string;
     *     user?: string;
     *     forwarded: boolean;
     *     forwardedDisabled: boolean;
     *     targets?: string[];
     *     tags: string[];
     *     metaData?: Record<string, any>;
     *     internalData?: Record<string, any>;
     *   }>;
     * }>} A promise resolving to the list of addresses.
     *
     * @example
     * // Fetch a paginated list of addresses
     * const result = await addresses.listAddresses({ limit: 10 });
     * console.log(result.results);
     */
    public async listAddresses(params?: {
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
        query: string;
        total: number;
        page: number;
        previousCursor: string | boolean;
        nextCursor: string | boolean;
        results: Array<{
            id: string;
            name: string;
            address: string;
            user?: string;
            forwarded: boolean;
            forwardedDisabled: boolean;
            targets?: string[];
            tags: string[];
            metaData?: Record<string, any>;
            internalData?: Record<string, any>;
        }>;
    }> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.client.get(`/addresses${query ? `?${query}` : ""}`);
    }

    /**
     * Create a new address for a user.
     *
     * @async
     * @function createAddress
     * @param {string} userId - The ID of the user to whom the address belongs.
     * @param {Object} payload - Address details.
     * @param {string} payload.address - The email address.
     * @param {string} payload.name - Identity name.
     * @param {boolean} [payload.main] - If true, sets this as the default address for the user.
     * @param {boolean} [payload.allowWildcard] - If true, allows wildcard addresses (e.g., *@example.com).
     * @param {Array<string>} [payload.tags] - Tags associated with the address.
     * @param {Object} [payload.metaData] - Custom metadata object.
     * @param {Object} [payload.internalData] - Internal metadata object.
     * @param {string} [payload.sess] - Session identifier for logs.
     * @param {string} [payload.ip] - IP address for logs.
     * @returns {Promise<{ success: boolean; id: string; }>} A promise resolving to the created address details.
     *
     * @example
     * // Create a new address for a user
     * const result = await addresses.createAddress("user123", {
     *   address: "example@example.com",
     *   name: "Example Name",
     *   main: true,
     *   tags: ["primary"],
     * });
     * console.log(result.id); // Address ID
     */
    public async createAddress(
        userId: string,
        payload: {
            address: string;
            name: string;
            main?: boolean;
            allowWildcard?: boolean;
            tags?: string[];
            metaData?: Record<string, any>;
            internalData?: Record<string, any>;
            sess?: string;
            ip?: string;
        }
    ): Promise<{ success: boolean; id: string }> {
        return this.client.post(`/users/${userId}/addresses`, payload);
    }

    /**
     * List all addresses for a specific user.
     *
     * @async
     * @function listUserAddresses
     * @param {string} userId - The ID of the user.
     * @param {Object} [params] - Query parameters.
     * @param {boolean} [params.metaData] - If true, includes metaData in the response.
     * @param {boolean} [params.internalData] - If true, includes internalData in the response.
     * @param {string} [params.sess] - Session identifier for logs.
     * @param {string} [params.ip] - IP address for logs.
     * @returns {Promise<{
     *   success: boolean;
     *   results: Array<{
     *     id: string;
     *     name: string;
     *     address: string;
     *     main: boolean;
     *     created: string;
     *     tags: string[];
     *     metaData?: Record<string, any>;
     *     internalData?: Record<string, any>;
     *   }>;
     * }>} A promise resolving to the list of addresses for the user.
     *
     * @example
     * // Fetch all addresses for a user
     * const result = await addresses.listUserAddresses("user123");
     * console.log(result.results);
     */
    public async listUserAddresses(
        userId: string,
        params?: { metaData?: boolean; internalData?: boolean; sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        results: Array<{
            id: string;
            name: string;
            address: string;
            main: boolean;
            created: string;
            tags: string[];
            metaData?: Record<string, any>;
            internalData?: Record<string, any>;
        }>;
    }> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.client.get(`/users/${userId}/addresses${query ? `?${query}` : ""}`);
    }

    /**
     * Get detailed information about a specific address.
     *
     * @async
     * @function getAddress
     * @param {string} userId - The ID of the user.
     * @param {string} addressId - The ID of the address.
     * @param {Object} [params] - Query parameters.
     * @param {string} [params.sess] - Session identifier for logs.
     * @param {string} [params.ip] - IP address for logs.
     * @returns {Promise<{
     *   success: boolean;
     *   id: string;
     *   name: string;
     *   address: string;
     *   main: boolean;
     *   created: string;
     *   tags: string[];
     *   metaData?: Record<string, any>;
     *   internalData?: Record<string, any>;
     * }>} A promise resolving to the address details.
     *
     * @example
     * // Get information about a specific address
     * const result = await addresses.getAddress("user123", "address456");
     * console.log(result.name); // Address identity name
     */
    public async getAddress(
        userId: string,
        addressId: string,
        params?: { sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        id: string;
        name: string;
        address: string;
        main: boolean;
        created: string;
        tags: string[];
        metaData?: Record<string, any>;
        internalData?: Record<string, any>;
    }> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.client.get(`/users/${userId}/addresses/${addressId}${query ? `?${query}` : ""}`);
    }

    /**
     * Delete an address for a specific user.
     *
     * @async
     * @function deleteAddress
     * @param {string} userId - The ID of the user.
     * @param {string} addressId - The ID of the address to delete.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Session identifier for logs.
     * @param {string} [params.ip] - IP address for logs.
     * @returns {Promise<{ success: boolean }>} A promise resolving to the success status.
     *
     * @example
     * // Delete an address for a user
     * const result = await addresses.deleteAddress("user123", "address456", { sess: "sess001", ip: "192.168.0.1" });
     * console.log(result.success); // true
     */
    public async deleteAddress(
        userId: string,
        addressId: string,
        params?: { sess?: string; ip?: string }
    ): Promise<{ success: boolean }> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.client.delete(`/users/${userId}/addresses/${addressId}${query ? `?${query}` : ""}`);
    }

    /**
     * Update address information for a user.
     *
     * @async
     * @function updateAddress
     * @param {string} userId - The ID of the user.
     * @param {string} addressId - The ID of the address to update.
     * @param {Object} payload - Address update details.
     * @param {string} [payload.name] - Identity name for the address.
     * @param {string} [payload.address] - New email address (only for normal addresses).
     * @param {boolean} [payload.main] - Indicates if this is the default address for the user.
     * @param {Array<string>} [payload.tags] - Tags associated with the address.
     * @param {Object} [payload.metaData] - Custom metadata object.
     * @param {Object} [payload.internalData] - Internal metadata object.
     * @param {string} [payload.sess] - Session identifier for logs.
     * @param {string} [payload.ip] - IP address for logs.
     * @returns {Promise<{ success: boolean }>} A promise resolving to the success status.
     *
     * @example
     * // Update an address for a user
     * const result = await addresses.updateAddress("user123", "address456", {
     *   name: "New Identity",
     *   tags: ["updated"],
     *   metaData: { additionalInfo: "info" },
     * });
     * console.log(result.success); // true
     */
    public async updateAddress(
        userId: string,
        addressId: string,
        payload: {
            name?: string;
            address?: string;
            main?: boolean;
            tags?: string[];
            metaData?: Record<string, any>;
            internalData?: Record<string, any>;
            sess?: string;
            ip?: string;
        }
    ): Promise<{ success: boolean }> {
        return this.client.put(`/users/${userId}/addresses/${addressId}`, payload);
    }

    /**
     * List addresses from the communication register.
     *
     * @async
     * @function listAddressesFromRegister
     * @param {string} userId - The ID of the user.
     * @param {Object} params - Query parameters.
     * @param {string} params.query - Prefix of an address or name to search for.
     * @param {number} [params.limit] - Number of records to return.
     * @param {string} [params.sess] - Session identifier for logs.
     * @param {string} [params.ip] - IP address for logs.
     * @returns {Promise<{
     *   success: boolean;
     *   results: Array<{
     *     id: string;
     *     name?: string;
     *     address: string;
     *   }>;
     * }>} A promise resolving to the list of addresses in the communication register.
     *
     * @example
     * // Fetch addresses matching a query
     * const result = await addresses.listAddressesFromRegister("user123", {
     *   query: "john",
     *   limit: 25,
     *   sess: "sess001",
     *   ip: "192.168.0.1",
     * });
     * console.log(result.results); // Array of addresses
     */
    public async listAddressesFromRegister(
        userId: string,
        params: { query: string; limit?: number; sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        results: Array<{
            id: string;
            name?: string;
            address: string;
        }>;
    }> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.client.get(`/users/${userId}/addressregister${query ? `?${query}` : ""}`);
    }

    /**
     * Create a new forwarded address.
     *
     * @async
     * @function createForwardedAddress
     * @param {Object} payload - Payload for the forwarded address.
     * @param {string} payload.address - E-mail address to forward.
     * @param {string} [payload.name] - Identity name for the address.
     * @param {Array<string>} payload.targets - An array of forwarding targets (emails or relay URLs).
     * @param {number} [payload.forwards] - Daily allowed forwarding count for this address.
     * @param {boolean} [payload.allowWildcard] - Whether wildcard addresses (e.g., *@example.com) are allowed.
     * @param {Object} [payload.autoreply] - Autoreply configuration for the address.
     * @param {boolean} [payload.autoreply.status] - Whether autoreply is enabled.
     * @param {string | boolean} [payload.autoreply.start] - Start time or `false` to disable.
     * @param {string | boolean} [payload.autoreply.end] - End time or `false` to disable.
     * @param {string} [payload.autoreply.name] - From header for autoreply.
     * @param {string} [payload.autoreply.subject] - Subject for autoreply.
     * @param {string} [payload.autoreply.text] - Plaintext autoreply message.
     * @param {string} [payload.autoreply.html] - HTML autoreply message.
     * @param {Array<string>} [payload.tags] - Tags associated with the address.
     * @param {Object} [payload.metaData] - Metadata for the address.
     * @param {Object} [payload.internalData] - Internal metadata for the address.
     * @param {string} [payload.sess] - Session identifier for logs.
     * @param {string} [payload.ip] - IP address for logs.
     * @returns {Promise<{ success: boolean; id: string }>} A promise resolving to the success status and address ID.
     *
     * @example
     * // Create a new forwarded address
     * const response = await createForwardedAddress({
     *   address: "example@domain.com",
     *   name: "Example Identity",
     *   targets: ["target@relay.com"],
     *   allowWildcard: true,
     *   tags: ["important"],
     * });
     * console.log(response.success); // true
     */
    public async createForwardedAddress(payload: {
        address: string;
        name?: string;
        targets: string[];
        forwards?: number;
        allowWildcard?: boolean;
        autoreply?: {
            status: boolean;
            start?: string | boolean;
            end?: string | boolean;
            name?: string;
            subject?: string;
            text?: string;
            html?: string;
        };
        tags?: string[];
        metaData?: Record<string, any>;
        internalData?: Record<string, any>;
        sess?: string;
        ip?: string;
    }): Promise<{ success: boolean; id: string }> {
        return this.client.post("/addresses/forwarded", payload);
    }

    /**
     * Update an existing forwarded address.
     *
     * @async
     * @function updateForwardedAddress
     * @param {string} addressId - The ID of the forwarded address to update.
     * @param {Object} payload - Payload with updated details.
     * @param {string} [payload.address] - New email address (cannot modify wildcard addresses).
     * @param {string} [payload.name] - Identity name for the address.
     * @param {Array<string>} [payload.targets] - New forwarding targets (overwrites previous targets).
     * @param {number} [payload.forwards] - Updated daily forwarding count.
     * @param {boolean} [payload.forwardedDisabled] - Whether to disable forwarding for this address.
     * @param {Object} [payload.autoreply] - Updated autoreply configuration.
     * @param {Array<string>} [payload.tags] - Updated tags associated with the address.
     * @param {Object} [payload.metaData] - Updated metadata for the address.
     * @param {Object} [payload.internalData] - Updated internal metadata for the address.
     * @param {string} [payload.sess] - Session identifier for logs.
     * @param {string} [payload.ip] - IP address for logs.
     * @returns {Promise<{ success: boolean }>} A promise resolving to the success status.
     *
     * @example
     * // Update a forwarded address
     * const response = await updateForwardedAddress("address123", {
     *   name: "Updated Identity",
     *   targets: ["newTarget@domain.com"],
     *   forwardedDisabled: true,
     * });
     * console.log(response.success); // true
     */
    public async updateForwardedAddress(
        addressId: string,
        payload: {
            address?: string;
            name?: string;
            targets?: string[];
            forwards?: number;
            forwardedDisabled?: boolean;
            autoreply?: {
                status?: boolean;
                start?: string | boolean;
                end?: string | boolean;
                name?: string;
                subject?: string;
                text?: string;
                html?: string;
            };
            tags?: string[];
            metaData?: Record<string, any>;
            internalData?: Record<string, any>;
            sess?: string;
            ip?: string;
        }
    ): Promise<{ success: boolean }> {
        return this.client.put(`/addresses/forwarded/${addressId}`, payload);
    }

    /**
     * Delete a forwarded address.
     *
     * @async
     * @function deleteForwardedAddress
     * @param {string} addressId - The ID of the forwarded address to delete.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Session identifier for logs.
     * @param {string} [params.ip] - IP address for logs.
     * @returns {Promise<{ success: boolean }>} A promise resolving to the success status.
     *
     * @example
     * // Delete a forwarded address
     * const response = await deleteForwardedAddress("address123", { sess: "sess001", ip: "192.168.0.1" });
     * console.log(response.success); // true
     */
    public async deleteForwardedAddress(
        addressId: string,
        params?: { sess?: string; ip?: string }
    ): Promise<{ success: boolean }> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.client.delete(`/addresses/forwarded/${addressId}${query ? `?${query}` : ""}`);
    }

    /**
     * Request detailed information about a forwarded address.
     *
     * @async
     * @function getForwardedAddressInfo
     * @param {string} addressId - The ID of the forwarded address.
     * @param {Object} [params] - Optional query parameters.
     * @param {string} [params.sess] - Session identifier for logs.
     * @param {string} [params.ip] - IP address for logs.
     * @returns {Promise<{
     *   success: boolean;
     *   id: string;
     *   address: string;
     *   name: string;
     *   targets: string[];
     *   limits: { forwards: any };
     *   autoreply: { status: boolean; name: string; subject: string; text: string; html: string };
     *   created: string;
     *   tags: string[];
     *   metaData?: Record<string, any>;
     *   internalData?: Record<string, any>;
     *   forwardedDisabled: boolean;
     * }>} A promise resolving to the forwarded address details.
     *
     * @example
     * // Get forwarded address info
     * const info = await getForwardedAddressInfo("address123", { sess: "sess001", ip: "192.168.0.1" });
     * console.log(info.address); // "example@domain.com"
     */
    public async getForwardedAddressInfo(
        addressId: string,
        params?: { sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        id: string;
        address: string;
        name: string;
        targets: string[];
        limits: { forwards: any };
        autoreply: { status: boolean; name: string; subject: string; text: string; html: string };
        created: string;
        tags: string[];
        metaData?: Record<string, any>;
        internalData?: Record<string, any>;
        forwardedDisabled: boolean;
    }> {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return this.client.get(`/addresses/forwarded/${addressId}${query ? `?${query}` : ""}`);
    }

    /**
     * Renames a domain for addresses, DKIM keys, and domain aliases.
     *
     * This method allows you to rename an existing domain to a new domain. It modifies associated addresses, DKIM keys,
     * and domain aliases accordingly.
     *
     * @async
     * @function renameDomainInAddresses
     * @param {Object} payload - The request payload containing the old and new domain names.
     * @param {string} payload.oldDomain - The existing domain name to be renamed.
     * @param {string} payload.newDomain - The new domain name to replace the old one.
     * @param {string} [payload.sess] - Optional session identifier for logging.
     * @param {string} [payload.ip] - Optional IP address for logging.
     * @returns {Promise<Object>} A promise that resolves to the response object.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {number} return.modifiedAddresses - The number of addresses that were modified.
     * @returns {number} return.modifiedUsers - The number of users affected by the operation.
     * @returns {number} return.modifiedDkim - The number of DKIM keys that were updated.
     * @returns {number} return.modifiedAliases - The number of domain aliases that were modified.
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * // Rename a domain in addresses
     * const payload = {
     *   oldDomain: "example.com",
     *   newDomain: "newdomain.com",
     *   sess: "sess123",
     *   ip: "192.168.0.1"
     * };
     * const result = await addresses.renameDomainInAddresses(payload);
     * console.log(result.success); // true
     * console.log(result.modifiedAddresses); // Number of addresses modified
     */

    /**
     * Resolves detailed information for a given address.
     *
     * This method fetches information about an address, including its ID, tags, forwarding limits,
     * and autoreply settings. It can optionally resolve wildcard addresses.
     *
     * @async
     * @function resolveAddressInfo
     * @param {string} address - The address or address ID to resolve.
     * @param {Object} [params] - Optional query parameters for the request.
     * @param {boolean} [params.allowWildcard] - If true, resolves wildcard addresses.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @returns {Promise<Object>} A promise that resolves to the address information.
     * @returns {boolean} return.success - Indicates whether the operation was successful.
     * @returns {string} return.id - The ID of the resolved address.
     * @returns {string} return.address - The email address string.
     * @returns {string} return.name - The identity name associated with the address.
     * @returns {Array<string>} return.tags - The list of tags associated with the address.
     * @returns {Object} return.limits - Forwarding limits for the address.
     * @returns {number} return.limits.forwards - The number of forwards allowed per day.
     * @returns {Object} return.autoreply - Autoreply settings for the address.
     * @returns {boolean} return.autoreply.status - Whether autoreply is enabled.
     * @returns {string} return.autoreply.name - The name used in the From header of the autoreply.
     * @returns {string} return.autoreply.subject - The subject line of the autoreply.
     * @returns {string} return.autoreply.text - The plaintext content of the autoreply.
     * @returns {string} return.autoreply.html - The HTML content of the autoreply.
     * @returns {string} return.created - The creation date of the address.
     * @returns {Object} [return.metaData] - Custom metadata associated with the address (if available).
     * @returns {Object} [return.internalData] - Internal metadata (if available).
     *
     * @throws {Error} If the API request fails or returns an error.
     *
     * @example
     * // Resolve address information
     * const params = { allowWildcard: true, sess: "sess123", ip: "192.168.0.1" };
     * const addressInfo = await addresses.resolveAddressInfo("user@example.com", params);
     * console.log(addressInfo.success); // true
     * console.log(addressInfo.name); // "John Doe"
     * console.log(addressInfo.autoreply.status); // true or false
     */
    public async resolveAddressInfo(
        address: string,
        params?: { allowWildcard?: boolean; sess?: string; ip?: string }
    ): Promise<{
        success: boolean;
        id: string;
        address: string;
        name: string;
        tags: string[];
        limits: { forwards: number };
        autoreply: {
            status: boolean;
            name: string;
            subject: string;
            text: string;
            html: string;
        };
        created: string;
        metaData?: Record<string, any>;
        internalData?: Record<string, any>;
    }> {
        const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
        return this.client.get(`/addresses/resolve/${encodeURIComponent(address)}${query}`);
    }

}
