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
 * A wrapper class for interacting with the WildDuck API.
 * It provides access to various modules, such as Authentication,
 * by utilizing the underlying ApiClient for HTTP communication.
 * 
 * @class WildduckNodeSDK
 */
export class WildduckNodeSDK {
  private client: ApiClient;
  public authentication: Authentication;
  public users: Users;

  /**
   * Creates an instance of the Wildduck-NodeSDK.
   * 
   * @constructor
   * @param {string} apiKey - The access token for authenticating API requests.
   * @param {string} apiUrl - The base URL of the WildDuck API.
   */
  constructor(apiKey: string, apiUrl: string) {
    // Initialize the underlying ApiClient
    this.client = new ApiClient(apiKey, apiUrl);

    /**
     * The authentication module for managing authentication-related operations.
     * Provides methods such as `preAuth`, `authenticate`, and more.
     *
     * @type {Authentication}
     */
    this.authentication = new Authentication(this.client);

    /**
     * The users module for managing user-related operations.
     * Provides methods such as `listUsers`, `createUser`, `getUser`, `updateUser`, and more.
     *
     * @type {Users}
     */
    this.users = new Users(this.client);
  }
}
