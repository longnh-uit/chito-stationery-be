const { addContact, getAllContacts } = require("../../services/contactService");

module.exports.addContact = async (req, res) => {
    try {
        await addContact(req.body);
        return res.json({ msg: "Contact saved!", success: true });
    } catch(error) {
        return res.status(400).json({ error: error, success: false });
    }
}

module.exports.getAllContact = async (req, res) => {
    try {
        const contacts = await getAllContacts();
        return res.json(contacts);
    } catch (error) {
        return res.status(400).json({ error: error, success: false });
    }
}