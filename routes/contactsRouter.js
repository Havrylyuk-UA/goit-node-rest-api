import express from 'express';

import contactsControllers from '../controllers/contactsControllers.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

import validateBody from '../decorators/validateBody.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsControllers.getAllContacts);

contactsRouter.get('/:id', contactsControllers.getOneContact);

contactsRouter.delete('/:id', contactsControllers.deleteContact);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  '/:id',
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  validateBody(updateContactSchema),
  contactsControllers.updateStatusContact
);

export default contactsRouter;
