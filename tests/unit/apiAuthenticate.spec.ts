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
 * Created on 11/29/24 :: 4:35 PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiAuthenticate.spec.ts is part of the wildduck-nodesdk.
 */

import { Authentication } from "../../src/api/Authentication";
import {ApiClient} from "../../src/utils/ApiClient";

describe("Authentication - Unit Tests", () => {
  let client: ApiClient;
  let auth: Authentication;

  beforeEach(() => {
    client = new ApiClient("test-api-key", "https://api.example.com");
    auth = new Authentication(client);
  });

  it("should successfully authenticate a user", async () => {
    jest.spyOn(client, "post").mockResolvedValue({
      success: true,
      id: "123",
      username: "testuser",
      address: "testuser@example.com",
      scope: "imap",
      require2fa: [],
    });

    const result = await auth.authenticate("testuser", "password123", "imap");
    expect(result.success).toBe(true);
    expect(result.username).toBe("testuser");
    expect(result.scope).toBe("imap");
  });

  it("should throw an error if the API returns an error", async () => {
    jest.spyOn(client, "post").mockRejectedValue(new Error("Unauthorized"));

    await expect(auth.authenticate("testuser", "wrongpassword", "imap")).rejects.toThrow("Unauthorized");
  });
});
