import { Contact } from './schemas/contacts';

export const listContacts = async () => {
  return Contact.find();
};

export const getContactById = async contactId => {
  return Contact.findOne({ _id: contactId });
};

export const removeContact = async contactId => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

export const addContact = async data => {
  return Contact.create({ ...data });
};

export const updateContactById = async (contactId, data) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, data, { new: true });
};
