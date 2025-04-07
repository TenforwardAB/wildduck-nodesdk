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
import { Addresses } from "./api/Addresses";
import { Messages } from "./api/Messages";
import { Mailboxes } from "./api/Mailboxes";
import { Submission } from "./api/Submission";
import { Filters } from "./api/Filters";

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
   * Provides methods for managing addresses, including creation, deletion, and updates.
   * @public
   * @type {Addresses}
   */
  public addresses: Addresses;

  /**
   * Provides methods for managing mailboxes, including creating, updating, and deleting mailboxes,
   * and advanced operations such as retrieving mailbox statistics.
   * @public
   * @type {Mailboxes}
   */
  public mailboxes: Mailboxes;

  /**
   * Provides methods for managing messages, including sending, receiving, and processing messages,
   * and advanced operations such as message search and threading.
   * @public
   * @type {Messages}
   */
  public messages: Messages;

  /**
   * Provides methods for managing submissions, including tracking and validating submissions.
   * @public
   * @type {Submission}
   */
  public submission: Submission;

  /**
   * Provides methods for managing filters, listing, adding/deleting and changing
   * @public
   * @type {Filters}
   */
  public filters: Filters;

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

    /**
     * Initializes the address management module.
     */
    this.addresses = new Addresses(this.client);

    /**
     * Initializes the mailbox management module.
     */
    this.mailboxes = new Mailboxes(this.client);

    /**
     * Initializes the message management module.
     */
    this.messages = new Messages(this.client);

    /**
     * Initializes the submission management module.
     */
    this.submission = new Submission(this.client);

    /**
     * Initializes the filters management module.
     */
    this.filters = new Filters(this.client);
  }
}

