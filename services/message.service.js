import ApiError from "../utils/ApiError.js";
import {
  createMessage,
  findAllMessages,
  findMessageById,
  deleteMessageById,
} from "../repositories/message.repository.js";

export const sendContactService = async (contactData) => {
  const { name, email, message, } = contactData;
  if (!name || !email || !message) { throw new ApiError(400, "All fields are required") }

  const savedMessage = await createMessage(contactData);
  return savedMessage;

};

export const getMessagesService = async () => { return await findAllMessages() };

export const deleteMessageService =
  async (messageId) => {
    const message =
      await findMessageById(messageId);
    if (!message) { throw new ApiError(404, "Message not found") }

    await deleteMessageById(message)
  };