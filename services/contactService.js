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

async function getContactById(id) {
    const contact = await Contact.findById(id);
    return contact;
}

module.exports = { addContact, getAllContacts, getContactById }