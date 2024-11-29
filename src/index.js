"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WildDuckAPI = void 0;
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
 * Created on 2024-11-29 :: 12:19 BY joyider <andre(-at-)sess.se>
 */
const ApiClient_1 = require("./utils/ApiClient");
const Authentication_1 = require("./api/Authentication");
/**
 * A wrapper class for interacting with the WildDuck API.
 * It provides access to various modules, such as Authentication,
 * by utilizing the underlying ApiClient for HTTP communication.
 *
 * @class WildDuckAPI
 */
class WildDuckAPI {
    /**
     * Creates an instance of the WildDuckAPI.
     *
     * @constructor
     * @param {string} apiKey - The access token for authenticating API requests.
     * @param {string} apiUrl - The base URL of the WildDuck API.
     */
    constructor(apiKey, apiUrl) {
        // Initialize the underlying ApiClient
        this.client = new ApiClient_1.ApiClient(apiKey, apiUrl);
        /**
         * The authentication module for managing authentication-related operations.
         * Provides methods such as `preAuth`, `authenticate`, and more.
         *
         * @type {Authentication}
         */
        this.authentication = new Authentication_1.Authentication(this.client);
    }
}
exports.WildDuckAPI = WildDuckAPI;
