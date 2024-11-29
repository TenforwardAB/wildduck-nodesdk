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
 * Created on 2024-11-29 :: 12:11 BY joyider <andre(-at-)sess.se>
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
exports.ApiClient = void 0;
/**
 * A generic API client for making HTTP requests.
 * Uses `X-Access-Token` for authentication with the WildDuck API.
 * Provides methods for GET, POST, and DELETE operations.
 *
 * @class ApiClient
 */
class ApiClient {
    /**
     * Creates an instance of the ApiClient.
     *
     * @constructor
     * @param {string} apiKey - The access token for authentication.
     * @param {string} apiUrl - The base URL of the API.
     */
    constructor(apiKey, apiUrl) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    }
    /**
     * Makes an HTTP GET request to the specified endpoint.
     *
     * @async
     * @function get
     * @param {string} endpoint - The API endpoint to call (relative to the base URL).
     * @param {Record<string, string>} [headers] - Optional additional headers.
     * @returns {Promise<any>} - A promise that resolves to the response JSON.
     *
     * @throws {Error} - If the HTTP request fails or the response is not successful.
     */
    get(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, headers = {}) {
            return this.request("GET", endpoint, undefined, headers);
        });
    }
    /**
     * Makes an HTTP POST request to the specified endpoint with a JSON payload.
     *
     * @async
     * @function post
     * @param {string} endpoint - The API endpoint to call (relative to the base URL).
     * @param {any} body - The JSON payload to send with the request.
     * @param {Record<string, string>} [headers] - Optional additional headers.
     * @returns {Promise<any>} - A promise that resolves to the response JSON.
     *
     * @throws {Error} - If the HTTP request fails or the response is not successful.
     */
    post(endpoint_1, body_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, body, headers = {}) {
            return this.request("POST", endpoint, body, headers);
        });
    }
    /**
     * Makes an HTTP DELETE request to the specified endpoint.
     *
     * @async
     * @function delete
     * @param {string} endpoint - The API endpoint to call (relative to the base URL).
     * @param {Record<string, string>} [headers] - Optional additional headers.
     * @returns {Promise<any>} - A promise that resolves to the response JSON.
     *
     * @throws {Error} - If the HTTP request fails or the response is not successful.
     */
    delete(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, headers = {}) {
            return this.request("DELETE", endpoint, undefined, headers);
        });
    }
    /**
     * A private method for making HTTP requests.
     * Adds the `X-Access-Token` header for authentication.
     *
     * @private
     * @async
     * @function request
     * @param {string} method - The HTTP method (GET, POST, DELETE).
     * @param {string} endpoint - The API endpoint to call (relative to the base URL).
     * @param {any} [body] - The request body for POST requests.
     * @param {Record<string, string>} [headers] - Optional additional headers.
     * @returns {Promise<any>} - A promise resolving to the response JSON.
     *
     * @throws {Error} - If the HTTP request fails or the response is not successful.
     */
    request(method_1, endpoint_1, body_1) {
        return __awaiter(this, arguments, void 0, function* (method, endpoint, body, headers = {}) {
            const url = `${this.apiUrl}${endpoint}`;
            const options = {
                method,
                headers: Object.assign({ "Content-Type": "application/json", "X-Access-Token": this.apiKey }, headers),
                body: body ? JSON.stringify(body) : undefined,
            };
            const response = yield fetch(url, options);
            if (!response.ok) {
                const error = yield response.json();
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
            }
            return response.json();
        });
    }
}
exports.ApiClient = ApiClient;
