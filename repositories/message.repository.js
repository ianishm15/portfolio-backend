import { Message } from "../models/Message.js";

export const createMessage =
  (data) =>
    Message.create(data);

export const findAllMessages =
  () =>
    Message.find()
      .sort({ createdAt: -1 });

export const findMessageById =
  (id) =>
    Message.findById(id);

export const deleteMessageById =
  (message) =>
    message.deleteOne();