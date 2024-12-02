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
 * Created on 12/2/24 :: 10:48AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: apiMessages.spec.ts is part of the wildduck-nodesdk.
 */

import {Messages} from "../../src/api/Messages";
import {ApiClient} from "../../src/utils/ApiClient";

jest.mock("../../src/utils/ApiClient");

describe("Messages Class", () => {
    let messages: Messages;
    let mockClient: jest.Mocked<ApiClient>;

    beforeEach(() => {
        mockClient = new ApiClient("mock-api-key", "https://mock-api-url") as jest.Mocked<ApiClient>;
        messages = new Messages(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("listMessages", () => {
        it("should list messages in a mailbox with query parameters", async () => {
            mockClient.get.mockResolvedValueOnce({
                success: true,
                total: 10,
                results: [],
            });

            const result = await messages.listMessages("user123", "mailbox456", {unseen: true});

            expect(mockClient.get).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages?unseen=true"
            );
            expect(result).toEqual({success: true, total: 10, results: []});
        });
    });

    describe("getMessageInfo", () => {
        it("should fetch message information with query parameters", async () => {
            mockClient.get.mockResolvedValueOnce({
                success: true,
                id: 789,
                mailbox: "mailbox456",
            });

            const result = await messages.getMessageInfo("user123", "mailbox456", 789, {
                markAsSeen: true,
            });

            expect(mockClient.get).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages/789?markAsSeen=true"
            );
            expect(result).toEqual({
                success: true,
                id: 789,
                mailbox: "mailbox456",
            });
        });
    });

    describe("updateMessage", () => {
        it("should update message flags or move the message", async () => {
            mockClient.put.mockResolvedValueOnce({
                success: true,
                updated: 1,
            });

            const result = await messages.updateMessage(
                "user123",
                "mailbox456",
                "789",
                {seen: true, moveTo: "newMailbox"}
            );

            expect(mockClient.put).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages/789",
                {seen: true, moveTo: "newMailbox"}
            );
            expect(result).toEqual({success: true, updated: 1});
        });
    });

    describe("deleteMessage", () => {
        it("should delete a specific message", async () => {
            mockClient.delete.mockResolvedValueOnce({success: true});

            const result = await messages.deleteMessage("user123", "mailbox456", 789);

            expect(mockClient.delete).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages/789"
            );
            expect(result).toEqual({success: true});
        });
    });

    describe("getMessageSource", () => {
        it("should fetch the message source as binary data", async () => {
            const mockBuffer = new ArrayBuffer(8);
            mockClient.get.mockResolvedValueOnce(mockBuffer);

            const result = await messages.getMessageSource("user123", "mailbox456", 789);

            expect(mockClient.get).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages/789/message.eml",
                {},
                "arraybuffer"
            );
            expect(result).toBe(mockBuffer);
        });

    });

    describe("downloadAttachment", () => {
        it("should fetch an attachment as binary data by default", async () => {
            const mockBuffer = new ArrayBuffer(8);
            const mockDataView = new Uint8Array(mockBuffer);
            for (let i = 0; i < mockDataView.length; i++) {
                mockDataView[i] = 0;
            }

            mockClient.get.mockResolvedValueOnce(Buffer.from(mockBuffer));

            const result = await messages.downloadAttachment("user123", "mailbox456", 789, "attachment001");

            const resultBuffer = result instanceof Buffer ? result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength) : result;

            expect(resultBuffer).toEqual(mockBuffer);
        });

        it("should fetch an attachment as string when specified", async () => {
            const mockString = "mock-attachment-content";
            mockClient.get.mockResolvedValueOnce(mockString);

            const result = await messages.downloadAttachment(
                "user123",
                "mailbox456",
                789,
                "attachment001",
                {sendAsString: true}
            );

            expect(mockClient.get).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages/789/attachments/attachment001?sendAsString=true",
                {},
                "text"
            );
            expect(result).toBe(mockString);
        });
    });

    describe("forwardMessage", () => {
        it("should forward a message with additional targets", async () => {
            mockClient.post.mockResolvedValueOnce({
                success: true,
                queueId: "queue123",
            });

            const result = await messages.forwardMessage(
                "user123",
                "mailbox456",
                789,
                {addresses: ["recipient@example.com"]}
            );

            expect(mockClient.post).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages/789/forward",
                {addresses: ["recipient@example.com"]}
            );
            expect(result).toEqual({success: true, queueId: "queue123"});
        });
    });

    describe("submitDraft", () => {
        it("should submit a draft message for delivery", async () => {
            mockClient.post.mockResolvedValueOnce({
                success: true,
                queueId: "queue123",
                message: {id: 789, mailbox: "mailbox456", size: 1234},
            });

            const result = await messages.submitDraft("user123", "mailbox456", 789, {sendTime: "2023-01-01T10:00:00Z"});

            expect(mockClient.post).toHaveBeenCalledWith(
                "/users/user123/mailboxes/mailbox456/messages/789/submit",
                {sendTime: "2023-01-01T10:00:00Z"}
            );
            expect(result).toEqual({
                success: true,
                queueId: "queue123",
                message: {id: 789, mailbox: "mailbox456", size: 1234},
            });
        });
    });

    describe("deleteOutboundMessage", () => {
        it("should delete an outbound message from the queue", async () => {
            mockClient.delete.mockResolvedValueOnce({success: true});

            const result = await messages.deleteOutboundMessage("user123", "queue001");

            expect(mockClient.delete).toHaveBeenCalledWith("/users/user123/outbound/queue001");
            expect(result).toEqual({success: true});
        });
    });
});
