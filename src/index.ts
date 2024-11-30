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
import { ApiClient } from "./utils/ApiClient";
import { Authentication } from "./api/Authentication";
import { Users } from "./api/Users";

/**
 * The main SDK class for interacting with the WildDuck API.
 * This class provides access to various modules, including authentication and user management.
 *
 * @class WildduckNodeSDK
 */
export class WildduckNodeSDK {
  /**
   * @private
   * @property {ApiClient} client - An instance of the ApiClient used to communicate with the WildDuck API.
   */
  private client: ApiClient;

  /**
   * Provides methods for authentication-related operations, such as login and token invalidation.
   * @public
   * @type {Authentication}
   */
  public authentication: Authentication;

  /**
   * Provides methods for managing users, including creating, updating, and deleting users,
   * and advanced operations such as quota recalculation and event streams.
   * @public
   * @type {Users}
   */
  public users: Users;

  /**
   * Creates an instance of the WildduckNodeSDK.
   *
   * @constructor
   * @param {string} apiKey - The API key used to authenticate requests to the WildDuck API.
   * @param {string} apiUrl - The base URL of the WildDuck API (e.g., "https://api.example.com").
   *
   * @example
   * // Initialize the SDK
   * const sdk = new WildduckNodeSDK("your-api-key", "https://api.example.com");
   * sdk.users.listUsers().then(users => console.log(users));
   */
  constructor(apiKey: string, apiUrl: string) {
    /**
     * @private
     * Initializes the API client with the provided API key and base URL.
     */
    this.client = new ApiClient(apiKey, apiUrl);

    /**
     * Initializes the authentication module.
     */
    this.authentication = new Authentication(this.client);

    /**
     * Initializes the user management module.
     */
    this.users = new Users(this.client);
  }
}

