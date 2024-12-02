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
 * Created on 12/2/24 :: 9:44 AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiMailboxes.spec.ts is part of the wildduck-nodesdk.
 */

import {Mailboxes} from "../../src/api/Mailboxes";
import {ApiClient} from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Mailbox Class", () => {
    let mailbox: Mailboxes;
    let mockClient: jest.Mocked<ApiClient>;

    beforeEach(() => {
        mockClient = new ApiClient("test-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        mailbox = new Mailboxes(mockClient);
    });

    describe("listMailboxes", () => {
        it("should call the API with the correct endpoint when no parameters are provided", async () => {
            mockClient.get.mockResolvedValue({success: true, results: []});

            await mailbox.listMailboxes("12345");

            expect(mockClient.get).toHaveBeenCalledWith("/users/12345/mailboxes");
        });

        it("should include query parameters in the API call", async () => {
            mockClient.get.mockResolvedValue({success: true, results: []});

            const params = {showHidden: true, counters: true, sizes: true};
            await mailbox.listMailboxes("12345", params);

            const expectedQuery = "?showHidden=true&counters=true&sizes=true";
            expect(mockClient.get).toHaveBeenCalledWith(`/users/12345/mailboxes${expectedQuery}`);
        });

        it("should return the API response as-is", async () => {
            const mockResponse = {success: true, results: [{id: "mailbox123", name: "Inbox"}]};
            mockClient.get.mockResolvedValue(mockResponse);

            const response = await mailbox.listMailboxes("12345");

            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.get.mockRejectedValue(new Error("API error"));

            await expect(mailbox.listMailboxes("12345")).rejects.toThrow("API error");
        });
    });

    describe("createMailbox", () => {
        it("should call the API with the correct payload", async () => {
            const mockResponse = {success: true, id: "mailbox123"};
            mockClient.post.mockResolvedValue(mockResponse);

            const payload = {path: "Inbox/Work", hidden: false, retention: 0};
            const response = await mailbox.createMailbox("12345", payload);

            expect(mockClient.post).toHaveBeenCalledWith("/users/12345/mailboxes", payload);
            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.post.mockRejectedValue(new Error("API error"));

            await expect(mailbox.createMailbox("12345", {path: "Inbox/Work"})).rejects.toThrow("API error");
        });
    });

    describe("getMailbox", () => {
        it("should call the API with the correct endpoint", async () => {
            const mockResponse = {success: true, id: "mailbox123", name: "Inbox"};
            mockClient.get.mockResolvedValue(mockResponse);

            const response = await mailbox.getMailbox("12345", "mailbox123");

            expect(mockClient.get).toHaveBeenCalledWith("/users/12345/mailboxes/mailbox123");
            expect(response).toEqual(mockResponse);
        });

        it("should include query parameters if provided", async () => {
            const mockResponse = {success: true, id: "mailbox123", name: "Inbox"};
            mockClient.get.mockResolvedValue(mockResponse);

            const params = {path: "Inbox/Work", sess: "sess123", ip: "192.168.0.1"};
            await mailbox.getMailbox("12345", "resolve", params);

            const expectedQuery = "/users/12345/mailboxes/resolve?path=Inbox%2FWork&sess=sess123&ip=192.168.0.1";
            expect(mockClient.get).toHaveBeenCalledWith(expectedQuery);
        });


        it("should throw an error if the API request fails", async () => {
            mockClient.get.mockRejectedValue(new Error("API error"));

            await expect(mailbox.getMailbox("12345", "mailbox123")).rejects.toThrow("API error");
        });
    });

    describe("updateMailbox", () => {
        it("should call the API with the correct payload", async () => {
            const mockResponse = {success: true};
            mockClient.put.mockResolvedValue(mockResponse);

            const payload = {path: "Inbox/Work/Renamed", retention: 0, hidden: false};
            const response = await mailbox.updateMailbox("12345", "mailbox123", payload);

            expect(mockClient.put).toHaveBeenCalledWith("/users/12345/mailboxes/mailbox123", payload);
            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.put.mockRejectedValue(new Error("API error"));

            await expect(mailbox.updateMailbox("12345", "mailbox123", {path: "Renamed"})).rejects.toThrow("API error");
        });
    });

    describe("deleteMailbox", () => {
        it("should call the API with the correct endpoint", async () => {
            const mockResponse = {success: true};
            mockClient.delete.mockResolvedValue(mockResponse);

            await mailbox.deleteMailbox("12345", "mailbox123");

            expect(mockClient.delete).toHaveBeenCalledWith("/users/12345/mailboxes/mailbox123");
        });

        it("should include query parameters if provided", async () => {
            const mockResponse = {success: true};
            mockClient.delete.mockResolvedValue(mockResponse);

            const params = {sess: "sess123", ip: "192.168.0.1"};
            await mailbox.deleteMailbox("12345", "mailbox123", params);

            const expectedQuery = "?sess=sess123&ip=192.168.0.1";
            expect(mockClient.delete).toHaveBeenCalledWith(`/users/12345/mailboxes/mailbox123${expectedQuery}`);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.delete.mockRejectedValue(new Error("API error"));

            await expect(mailbox.deleteMailbox("12345", "mailbox123")).rejects.toThrow("API error");
        });
    });
});
