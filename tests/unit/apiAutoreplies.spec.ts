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
 * Copyright (c) 2024- Tenforward AB. All rights reserved.
 *
 * Created on 4/7/25 :: 3:53PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiAutoreplies.spec.ts is part of the wildduck-nodesdk project.
 */

import { Autoreplies } from "../../src/api/Autoreplies";
import { ApiClient } from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Autoreplies Class", () => {
    let autoreplies: Autoreplies;
    let mockClient: jest.Mocked<ApiClient>;

    beforeEach(() => {
        mockClient = new ApiClient("test-api-key", "http://mock-api-url") as jest.Mocked<ApiClient>;
        autoreplies = new Autoreplies(mockClient);
    });

    describe("getAutoreplyInformation", () => {
        it("should call the API with the correct endpoint when no query parameters are provided", async () => {
            const mockResponse = {
                success: true,
                status: true,
                name: "John Doe",
                subject: "Out of Office",
                text: "I am currently out of the office.",
                html: "<p>I am currently out of the office.</p>",
                start: "2023-01-01T00:00:00Z",
                end: "2023-01-02T00:00:00Z",
                created: "2023-01-01T00:00:00Z",
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await autoreplies.getAutoreplyInformation("12345");

            expect(mockClient.get).toHaveBeenCalledWith("/users/12345/autoreply");
        });

        it("should include query parameters in the API call", async () => {
            const params = { sess: "sess123", ip: "192.168.0.1" };
            const expectedQuery = "?sess=sess123&ip=192.168.0.1";
            const mockResponse = {
                success: true,
                status: false,
                name: "Jane Doe",
                subject: "",
                text: "Auto reply message",
                html: "<p>Auto reply message</p>",
                start: false,
                end: false,
                created: "2023-01-01T00:00:00Z",
            };
            mockClient.get.mockResolvedValue(mockResponse);

            await autoreplies.getAutoreplyInformation("12345", params);

            expect(mockClient.get).toHaveBeenCalledWith(`/users/12345/autoreply${expectedQuery}`);
        });

        it("should return the API response as-is", async () => {
            const mockResponse = {
                success: true,
                status: true,
                name: "John Doe",
                subject: "Out of Office",
                text: "I am currently out of the office.",
                html: "<p>I am currently out of the office.</p>",
                start: "2023-01-01T00:00:00Z",
                end: "2023-01-02T00:00:00Z",
                created: "2023-01-01T00:00:00Z",
            };
            mockClient.get.mockResolvedValue(mockResponse);

            const response = await autoreplies.getAutoreplyInformation("12345");

            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.get.mockRejectedValue(new Error("API error"));

            await expect(autoreplies.getAutoreplyInformation("12345")).rejects.toThrow("API error");
        });
    });

    describe("updateAutoReply", () => {
        it("should call the API with the correct payload", async () => {
            const payload = {
                status: true,
                name: "John Doe",
                subject: "Out of Office",
                text: "I am currently out of the office.",
                html: "<p>I am currently out of the office.</p>",
                start: "2023-01-01T00:00:00Z",
                end: "2023-01-02T00:00:00Z",
                sess: "sess123",
                ip: "192.168.0.1",
            };
            const mockResponse = { success: true, id: "autoreply123" };
            mockClient.put.mockResolvedValue(mockResponse);

            const response = await autoreplies.updateAutoReply("12345", payload);

            expect(mockClient.put).toHaveBeenCalledWith("/users/12345/autoreply", payload);
            expect(response).toEqual(mockResponse);
        });

        it("should throw an error if the API request fails", async () => {
            const payload = {
                status: false,
                name: "John Doe",
                subject: "",
                text: "Auto reply disabled",
                html: "",
                start: false,
                end: false,
            };
            mockClient.put.mockRejectedValue(new Error("API error"));

            await expect(autoreplies.updateAutoReply("12345", payload)).rejects.toThrow("API error");
        });
    });

    describe("removeAutoreply", () => {
        it("should call the API with the correct endpoint when no query parameters are provided", async () => {
            const mockResponse = { success: true };
            mockClient.delete.mockResolvedValue(mockResponse);

            await autoreplies.removeAutoreply("12345");

            expect(mockClient.delete).toHaveBeenCalledWith("/users/12345/autoreply");
        });

        it("should include query parameters in the API call", async () => {
            const params = { sess: "sess123", ip: "192.168.0.1" };
            const expectedQuery = "?sess=sess123&ip=192.168.0.1";
            const mockResponse = { success: true };
            mockClient.delete.mockResolvedValue(mockResponse);

            await autoreplies.removeAutoreply("12345", params);

            expect(mockClient.delete).toHaveBeenCalledWith(`/users/12345/autoreply${expectedQuery}`);
        });

        it("should throw an error if the API request fails", async () => {
            mockClient.delete.mockRejectedValue(new Error("API error"));

            await expect(autoreplies.removeAutoreply("12345")).rejects.toThrow("API error");
        });
    });
});
