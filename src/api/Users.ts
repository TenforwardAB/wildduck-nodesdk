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

import { ApiClient } from "../utils/ApiClient";

export class Users {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Fetch a list of registered users.
   * @param params Query parameters for filtering users.
   * @returns List of users matching the query.
   */
  async listUsers(params?: Record<string, string | number | boolean>): Promise<any> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.client.get(`/users${query ? `?${query}` : ""}`);
  }

  /**
   * Create a new user.
   * @param userData Data for the new user.
   * @returns The created user's ID.
   */
  async createUser(userData: Record<string, any>): Promise<any> {
    return this.client.post("/users", userData);
  }

  /**
   * Resolve a user ID by username.
   * @param username The username to resolve.
   * @returns The user's unique ID.
   */
  async resolveUser(username: string): Promise<any> {
    return this.client.get(`/users/resolve/${username}`);
  }

  /**
   * Fetch information about a specific user.
   * @param userId The user's ID.
   * @returns Detailed user information.
   */
  async getUser(userId: string): Promise<any> {
    return this.client.get(`/users/${userId}`);
  }

  /**
   * Update user information.
   * @param userId The user's ID.
   * @param updates Data to update for the user.
   * @returns Success status.
   */
  async updateUser(userId: string, updates: Record<string, any>): Promise<any> {
    return this.client.put(`/users/${userId}`, updates);
  }

  /**
   * Delete a user.
   * @param userId The user's ID.
   * @param params Additional options (e.g., `deleteAfter`).
   * @returns Deletion task details.
   */
  async deleteUser(userId: string, params?: Record<string, string>): Promise<any> {
    const query = new URLSearchParams(params).toString();
    return this.client.delete(`/users/${userId}${query ? `?${query}` : ""}`);
  }

  /**
   * Log out a user.
   * @param userId The user's ID.
   * @param data Reason and additional information.
   * @returns Success status.
   */
  async logoutUser(userId: string, data: Record<string, string>): Promise<any> {
      return this.client.put(`/users/${userId}/logout`, data);
  }

    /**
     * Recalculate quota for a specific user or the current user if no userId is provided.
     * Allows optional session and IP data in the request body.
     *
     * @param {string} [userId] - The user's ID. Defaults to `me` if not provided.
     * @param {Object} [data] - Optional data for the request body.
     * @param {string} [data.sess] - Session identifier for the logs.
     * @param {string} [data.ip] - IP address for the logs.
     * @returns {Promise<any>} Quota recalculation details.
     */
    async resetQuota(
        userId?: string,
        data?: { sess?: string; ip?: string }
    ): Promise<any> {
        const targetUser = userId || "me";
        return this.client.post(`/users/${targetUser}/quota/reset`, data || {});
    }

    /**
     * Reset a user's password.
     * @param userId The user's ID.
     * @param data Additional options (e.g., `validAfter`).
     * @returns The new temporary password.
     */
    async resetPassword(userId: string, data?: Record<string, string>): Promise<any> {
        return this.client.post(`/users/${userId}/password/reset`, data || {});
    }

  /**
   * Get recovery information for a deleted user.
   * @param userId The user's ID.
   * @returns Recovery details.
   */
  async getRecoveryInfo(userId: string): Promise<any> {
    return this.client.get(`/users/${userId}/restore`);
  }

  /**
   * Cancel deletion for a user.
   * @param userId The user's ID.
   * @param data Session details.
   * @returns Success status.
   */
  async cancelDeletion(userId: string, data: Record<string, string>): Promise<any> {
    return this.client.post(`/users/${userId}/restore`, data);
  }
}

