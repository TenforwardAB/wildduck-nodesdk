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
 * Created on 11/30/24 :: 1:49PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiUsers.spec.ts is part of the wildduck-nodesdk.
 */

import { Users } from "../../src/api/Users";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Users Module", () => {
    let mockClient: jest.Mocked<ApiClient>;
    let users: Users;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        users = new Users(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("listUsers calls the correct API endpoint", async () => {
        mockClient.get.mockResolvedValueOnce({success: true, results: []});

        const params = {query: "test-user", limit: 10};
        await users.listUsers(params);

        expect(mockClient.get).toHaveBeenCalledWith("/users?query=test-user&limit=10");
    });

    test("createUser sends correct data", async () => {
        mockClient.post.mockResolvedValueOnce({success: true, id: "12345"});

        const userData = {username: "test-user", password: "password123"};
        await users.createUser(userData);

        expect(mockClient.post).toHaveBeenCalledWith("/users", userData);
    });

    test("resolveUser calls the correct endpoint", async () => {
        mockClient.get.mockResolvedValueOnce({success: true, id: "12345"});

        await users.resolveUser("test-user", {sess: "abc123"});

        expect(mockClient.get).toHaveBeenCalledWith("/users/resolve/test-user?sess=abc123");
    });

    test("getUser calls the correct endpoint", async () => {
        mockClient.get.mockResolvedValueOnce({success: true, id: "12345"});

        await users.getUser("12345");

        expect(mockClient.get).toHaveBeenCalledWith("/users/12345");
    });

    test("updateUser sends correct data", async () => {
        mockClient.put.mockResolvedValueOnce({success: true});

        const updates = {name: "Updated User"};
        await users.updateUser("12345", updates);

        expect(mockClient.put).toHaveBeenCalledWith("/users/12345", updates);
    });

    test("deleteUser calls the correct endpoint", async () => {
        mockClient.delete.mockResolvedValueOnce({success: true});

        await users.deleteUser("12345", {sess: "abc123"});

        expect(mockClient.delete).toHaveBeenCalledWith("/users/12345?sess=abc123");
    });

    test("logoutUser sends correct data", async () => {
        mockClient.put.mockResolvedValueOnce({success: true});

        const data = {reason: "Logout reason"};
        await users.logoutUser("12345", data);

        expect(mockClient.put).toHaveBeenCalledWith("/users/12345/logout", data);
    });

    test("recalculateUserQuota sends correct data", async () => {
        mockClient.post.mockResolvedValueOnce({success: true});

        await users.recalculateUserQuota("12345", {sess: "abc123"});

        expect(mockClient.post).toHaveBeenCalledWith("/users/12345/quota/reset", {sess: "abc123"});
    });

    test("recalculateAllUsersQuota sends correct data", async () => {
        mockClient.post.mockResolvedValueOnce({success: true});

        await users.recalculateAllUsersQuota({sess: "abc123"});

        expect(mockClient.post).toHaveBeenCalledWith("/quota/reset", {sess: "abc123"});
    });

    test("resetPassword sends correct data", async () => {
        mockClient.post.mockResolvedValueOnce({success: true, password: "new-temp-password"});

        const data = {validAfter: "2023-01-01T00:00:00Z"};
        await users.resetPassword("12345", data);

        expect(mockClient.post).toHaveBeenCalledWith("/users/12345/password/reset", data);
    });

    test("getRecoveryInfo calls the correct endpoint", async () => {
        mockClient.get.mockResolvedValueOnce({success: true});

        await users.getRecoveryInfo("12345");

        expect(mockClient.get).toHaveBeenCalledWith("/users/12345/restore");
    });

    test("cancelDeletion sends correct data", async () => {
        mockClient.post.mockResolvedValueOnce({success: true});

        const data = {sess: "abc123"};
        await users.cancelDeletion("12345", data);

        expect(mockClient.post).toHaveBeenCalledWith("/users/12345/restore", data);
    });

    /* Removing test for openChangeStream since we have issues with that api route
  test("openChangeStream creates an EventSource with correct URL", () => {
      const mockEventSourceInstance = {
          addEventListener: jest.fn(),
          close: jest.fn(),
      };

      const eventSourceMock = jest.fn().mockImplementation(() => mockEventSourceInstance);

      global.EventSource = eventSourceMock;

      users.openChangeStream("12345", { sess: "abc123" });

      expect(eventSourceMock).toHaveBeenCalledWith("http://mock-api-url/users/12345/updates?sess=abc123");

      expect(eventSourceMock).toHaveBeenCalledTimes(1);
  });*/


});

