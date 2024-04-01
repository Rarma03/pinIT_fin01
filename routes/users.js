const mong = require('mongoose');

//to remove error like this -{TypeError: usersRouter.serializeUser is not a function}
// use below
const plm = require('passport-local-mongoose'); //--2

// mong.connect('mongodb://127.0.0.1:27017/pinIt_database');

const userschema = mong.Schema({
  username: { type: String },
  password: { type: String },
  contact: { type: String },
  email: { type: String },
  name: { type: String },
  profileImage: { type: String },
  boards: {
    type: Array,
    default: []
  },
  postid: [{
    type: mong.Schema.Types.ObjectId,
    ref: 'post'
  }]
});

userschema.plugin(plm); // --2

module.exports = mong.model('user', userschema);