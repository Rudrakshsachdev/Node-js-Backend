
const contactModel = require("../models/contactModel");

const asyncHandler = require("express-async-handler");

const {errorHandler} = require("../middleware/errorHandler");


const getContacts = asyncHandler(async (req, res) => {
    const contacts = await contactModel.find();
    res.status(200).json(contacts);
});



const createContact = asyncHandler(async (req, res) => {
  // Handle contact creation logic here
  console.log("Creating contact:", req.body);

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    errorHandler(new Error("Name, email, and phone are required fields."), req, res);
  }

  const newContact = new contactModel({ name, email, phone });
  await newContact.save();

  res.status(201).json(newContact);
});

const updateContact = asyncHandler(async (req, res) => {
    const contact = await contactModel.findById(req.params.id);

    if (!contact) {
        res.status(404).json({ message: "Contact not found" });
        return;
    }

    const updatedContact = await contactModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
  res.status(201).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.findById(req.params.id);


  if (!contact) {
    res.status(404).json(deleteContact);
  }

  await contactModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Contact deleted successfully" });
});

const getContactById = asyncHandler(async (req, res) => {

    const contact = await contactModel.findById(req.params.id);

    if (!contact) {
        res.status(404).json({ message: "Contact not found" });
        return;
    }
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactById,
};
