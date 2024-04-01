import { Contact } from '../models/contacts.js';

export const listContacts = async (filter = {}) => {
  return Contact.find(filter).populate('owner', 'email subscription');
};

export const getContactById = async contactId => {
  return Contact.findById(contactId);
};

export const removeContact = async contactId => {
  return Contact.findByIdAndDelete(contactId);
};

export const addContact = async data => {
  return Contact.create(data);
};

export const updateContactById = async (contactId, data) => {
  return Contact.findOneAndUpdate(contactId, data, {
    returnDocument: 'after',
  });
};

export const updateFavoriteStatus = async (contactId, data) => {
  const status = { favorite: data };
  return Contact.findByIdAndUpdate(contactId, status, {
    new: true,
  });
};
