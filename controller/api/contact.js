const { addContact, getAllContacts, getContactById } = require("../../services/contactService");
const { getPage } = require("../../helper/utils");

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
        const { page } = req.query;
        let contacts = await getAllContacts();
        const maxPage = Math.ceil(contacts.length / 10);
        contacts = await getPage(contacts, page || 1, 10);
        return res.json({ contacts, maxPage });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ error: "Something went wrong", success: false });
    }
}

module.exports.getContactById = async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id) {
            next();
            return;
        }
        const contact = await getContactById(id);
        if (contact)
            res.json({ contact });
        else res.status(400).json({ error: "Id not found", success:false });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ error: "Something went wrong :((", success: false })
    }
}