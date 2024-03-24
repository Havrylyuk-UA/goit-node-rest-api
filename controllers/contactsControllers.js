import * as contactsService from '../services/contactsServices.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../decorators/ctrlWrapper.js';

const getAllContacts = async (req, res) => {
  const results = await contactsService.listContacts();
  res.json(results);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.getContactById(id);

  if (!result) {
    throw HttpError(404, `Not found`);
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.removeContact(id);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const result = await contactsService.addContact({ name, email, phone });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, `Body must have at least one field`);
  }

  const result = await contactsService.updateContactById(id, req.body);

  if (!result) {
    throw HttpError(404, `Not found`);
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;

  console.log(req);

  const result = contactsService.updateFavoriteStatus(id, req.body);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.status(200).json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
