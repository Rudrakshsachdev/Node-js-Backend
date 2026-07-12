const express = require("express");
const dotenv = require("dotenv");

const router = express.Router();

const { getContacts, createContact, updateContact, deleteContact, getContactById } = require("../controllers/contactController");


router.route("/").get(getContacts);

router.route("/").post(createContact);
        
router.route("/:id").get(getContactById);

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);

module.exports = router;
