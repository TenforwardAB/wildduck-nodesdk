"use strict";
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
 * Created on 2024-11-29 :: 11:56 BY joyider <andre(-at-)sess.se>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
/**
 * A class for handling authentication-related operations in the WildDuck API.
 * Provides methods for pre-authentication, user authentication, token invalidation,
 * and retrieving authentication events.
 *
 * @class Authentication
 */
class Authentication {
    /**
     * Creates an instance of the Authentication class.
     *
     * @constructor
     * @param {ApiClient} client - An instance of the ApiClient used to communicate with the API.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Checks if a username exists and can be used for authentication.
     *
     * @async
     * @function preAuth
     * @param {string} username - The username or email address to check.
     * @param {string} scope - The required scope (e.g., master, imap, smtp, pop3).
     * @param {string} [sess] - Optional session identifier for logging.
     * @param {string} [ip] - Optional IP address for logging.
     * @returns {Promise<object>} - A promise that resolves to the pre-authentication response.
     *
     * @throws {Error} - If the API request fails or returns an error.
     */
    preAuth(username, scope, sess, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { username, scope, sess, ip };
            return this.client.post("/preauth", payload);
        });
    }
    /**
    * Authenticates a user and optionally generates a temporary access token.
    *
    * @async
    * @function authenticate
    * @param {string} username - The username or email address of the user.
    * @param {string} password - The password of the user.
    * @param {string} scope - The required scope (e.g., master, imap, smtp, pop3).
    * @param {string} [protocol] - Optional protocol identifier for logging.
    * @param {string} [appId] - Optional app identifier for logging.
    * @param {boolean} [token] - If true, generates a temporary access token.
    * @param {string} [sess] - Optional session identifier for logging.
    * @param {string} [ip] - Optional IP address for logging.
    * @returns {Promise<object>} - A promise that resolves to the authentication response.
    *
    * @throws {Error} - If the API request fails or returns an error.
    */
    authenticate(username, password, scope, protocol, appId, token, sess, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { username, password, scope, protocol, appId, token, sess, ip };
            return this.client.post("/authenticate", payload);
        });
    }
    /**
     * Invalidates the currently used authentication token.
     *
     * @async
     * @function invalidateToken
     * @returns {Promise<object>} - A promise that resolves to the response from the API.
     *
     * @throws {Error} - If the API request fails or returns an error.
     */
    invalidateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.delete("/authenticate");
        });
    }
    /**
     * Retrieves a list of authentication events for a user.
     *
     * @async
     * @function listAuthEvents
     * @param {string} user - The user ID or "me" for the current user.
     * @param {object} [params] - Optional query parameters for filtering the events.
     * @param {string} [params.action] - Limit results to a specific action type.
     * @param {number} [params.limit] - Maximum number of events to retrieve.
     * @param {string} [params.next] - Cursor for the next page of results.
     * @param {string} [params.previous] - Cursor for the previous page of results.
     * @param {number} [params.page] - Informational current page number.
     * @param {string} [params.filterip] - Filter results by specific IP address.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @param {boolean} [useOwnToken=false] - Whether to use the current user's token ("me").
     * @returns {Promise<object>} - A promise that resolves to the list of authentication events.
     *
     * @throws {Error} - If the API request fails or returns an error.
     */
    listAuthEvents(user_1) {
        return __awaiter(this, arguments, void 0, function* (user, params = {}, useOwnToken = false) {
            const resolvedUser = useOwnToken ? "me" : user;
            const query = new URLSearchParams(params).toString();
            const endpoint = `/users/${resolvedUser}/authlog${query ? `?${query}` : ""}`;
            return this.client.get(endpoint);
        });
    }
    /**
     * Retrieves details about a specific authentication event.
     *
     * @async
     * @function getAuthEvent
     * @param {string} user - The user ID or "me" for the current user.
     * @param {string} event - The ID of the authentication event.
     * @param {object} [params] - Optional query parameters for filtering the event details.
     * @param {string} [params.sess] - Optional session identifier for logging.
     * @param {string} [params.ip] - Optional IP address for logging.
     * @param {boolean} [useOwnToken=false] - Whether to use the current user's token ("me").
     * @returns {Promise<object>} - A promise that resolves to the event details.
     *
     * @throws {Error} - If the API request fails or returns an error.
     */
    getAuthEvent(user_1, event_1) {
        return __awaiter(this, arguments, void 0, function* (user, event, params = {}, useOwnToken = false) {
            const resolvedUser = useOwnToken ? "me" : user;
            const query = new URLSearchParams(params).toString();
            const endpoint = `/users/${resolvedUser}/authlog/${event}${query ? `?${query}` : ""}`;
            return this.client.get(endpoint);
        });
    }
}
exports.Authentication = Authentication;