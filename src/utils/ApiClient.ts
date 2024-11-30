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

/**
 * A generic API client for making HTTP requests.
 * Uses `X-Access-Token` for authentication with the WildDuck API.
 * Provides methods for GET, POST, and DELETE operations.
 *
 * @class ApiClient
 */
export class ApiClient {
    private apiKey: string;
    private apiUrl: string;

    /**
     * Creates an instance of the ApiClient.
     *
     * @constructor
     * @param {string} apiKey - The access token for authentication.
     * @param {string} apiUrl - The base URL of the API.
     */
    constructor(apiKey: string, apiUrl: string) {
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
    public async get(endpoint: string, headers: Record<string, string> = {}): Promise<any> {
        return this.request("GET", endpoint, undefined, headers);
    }

    /**
     * Makes an HTTP PUT request to the specified endpoint with a JSON payload.
     *
     * @async
     * @function put
     * @param {string} endpoint - The API endpoint to call (relative to the base URL).
     * @param {any} body - The JSON payload to send with the request.
     * @param {Record<string, string>} [headers] - Optional additional headers.
     * @returns {Promise<any>} - A promise that resolves to the response JSON.
     *
     * @throws {Error} - If the HTTP request fails or the response is not successful.
     */
    public async put(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<any> {
        return this.request("PUT", endpoint, body, headers);
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
    public async post(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<any> {
        return this.request("POST", endpoint, body, headers);
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
    public async delete(endpoint: string, headers: Record<string, string> = {}): Promise<any> {
        return this.request("DELETE", endpoint, undefined, headers);
    }

    /**
     * Create a real-time EventSource stream.
     * @param endpoint The API endpoint for the stream.
     * @param params Query parameters to append to the URL.
     * @returns {EventSource} An EventSource object for the stream.
     */
    public stream(endpoint: string, params?: Record<string, string>): EventSource {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        const url = `${this.apiUrl}${endpoint}${query}`;
        console.log("Stream URL:", `${this.apiUrl}${endpoint}${query}`);

        const eventSource = new EventSource(url);
        eventSource.addEventListener("open", () => {
            console.log(`Stream opened: ${url}`);
        });
        eventSource.addEventListener("error", (error) => {
            console.error(`Stream error on ${url}:`, error);
        });
        return eventSource;
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
    private async request(
        method: string,
        endpoint: string,
        body?: any,
        headers: Record<string, string> = {}
    ): Promise<any> {
        const url = `${this.apiUrl}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-Access-Token": this.apiKey,
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
        }
        return response.json();
    }
}
