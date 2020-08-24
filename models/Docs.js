const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const DocsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    docId: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    editedBy: [{
        type: String,
        require: true,
    }],
    content: {
        type: String,
        required: true,
    }
})

module.exports = Docs = mongoose.model('Docs', DocsSchema);