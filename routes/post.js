const mong = require('mongoose');

// mong.connect('mongodb://127.0.0.1:27017/pinIt_database');

const postschema = mong.Schema({
    userid: { type: mong.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String },
    description: { type: String },
    image: { type: String }
});

module.exports = mong.model('post', postschema);