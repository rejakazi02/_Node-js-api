const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        required: false
    },
    registrationAt: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    hasAccess: {
        type: Boolean,
        required: true
    }
});


module.exports = mongoose.model('Admin', schema);
