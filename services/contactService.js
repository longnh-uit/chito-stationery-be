const Contact = require("../models/database/contacts");

async function addContact(contact) {
    try {
        const newContact = new Contact(contact);
        await newContact.save();
        return newContact;
    } catch(error) {
        throw error;
    }
}

module.exports = { addContact }