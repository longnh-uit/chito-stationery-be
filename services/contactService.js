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

async function getAllContacts() {
    const contacts = await Contact.find();
    return contacts;
}

module.exports = { addContact, getAllContacts }