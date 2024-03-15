import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';

const contactsPath = path.join('db', 'contacts.json');

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

export const getContactById = async contactId => {
  const data = await listContacts();
  const contactById = data.find(contact => contact.id === contactId);
  return contactById || null;
};

export const removeContact = async contactId => {
  const data = await listContacts();
  const index = data.findIndex(contact => contact.id === contactId);

  if (index === -1) {
    return null;
  }
  const [result] = data.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return result;
};

export const addContact = async data => {
  const contacts = await listContacts();

  const newContact = {
    id: nanoid(),
    ...data,
  };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

export const updateContactById = async (id, data) => {
  const contact = await listContacts();

  const index = contact.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }

  contact[index] = { ...contact[index], ...data };

  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));

  return contact[index];
};
