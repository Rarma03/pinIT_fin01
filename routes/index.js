var express = require('express');
var router = express.Router();
const usermodel = require('./users');
const postmodel = require('./post');
const passport = require('passport');
const upload = require('./multer');
const flash = require('connect-flash');

const localStrategy = require('passport-local');
passport.use(new localStrategy(usermodel.authenticate()));


// login -1
router.get('/', function (req, res, next) {
  res.render('index', { nav: false, error: req.flash('error') });
});


//Registering a new User
router.get('/register', function (req, res, next) {
  res.render('register', { nav: false, error: req.flash('error') });
});
router.post('/register', function (req, res, next) {
  // const data = new usermodel({
  //   username: req.body.username,
  //   email: req.body.email,
  //   contact: req.body.contact
  // })

  // usermodel.register(data, req.body.password)
  //   .then(function () {
  //     passport.authenticate('local')(req, res, function () {
  //       res.redirect('/profile')
  //     })
  //   })
  if (!req.body.username || !req.body.email || !req.body.contact || !req.body.password) {
    req.flash('error', 'Please fill in all the required fields');
    return res.redirect('/register'); // Redirect back to the registration page
  }

  const data = new usermodel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact
  });

  usermodel.register(data, req.body.password)
    .then(function () {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      });
    })
    .catch(function (err) {
      // Handle registration errors, e.g., duplicate email or username
      req.flash('error', 'Registration failed. Please try again.');
      res.redirect('/register'); // Redirect back to the registration page
    });
});
// router.post('/register', passport.authenticate('local', {
//   failureRedirect: '/register',
//   successRedirect: '/profile',
//   failureFlash: true
// }))

// Logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

//profile page
router.get('/profile', isLoggedIn, async function (req, res, next) {

  const user = await usermodel.findOne({ username: req.session.passport.user })
    .populate('postid')

  console.log(user);

  res.render('profile', { user, nav: true });
})


//if a user want to login into account
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) { })


//file uploading
router.post('/fileupload', isLoggedIn, upload.single('image'), async function (req, res, next) {
  if (!req.file) {
    return res.status(400).send('No file Selected');
  }
  // res.send('File Successfully UPLOADED');
  // joh file upload hui hain save it as post and provide userid to it
  // similarly add postid in userposts

  const user = await usermodel.findOne({ username: req.session.passport.user });

  user.profileImage = req.file.filename;
  // const postdata = await postmodel.create({
  //   image: req.file.filename,
  //   imageText: req.body.filecaption,
  //   userid: user._id
  // })

  // user.posts.push(postdata._id);
  await user.save();

  // res.send('done');
  res.redirect('/profile');

  // try {
  //   if (!req.file) {
  //     return res.status(400).send('No file Selected');
  //   }

  //   // Process the uploaded image
  //   const outputPath = './public/images/uploads/resized-' + req.file.filename;
  //   await processImage(req.file.path, outputPath);

  //   // Update user profile image
  //   const user = await usermodel.findOne({ username: req.session.passport.user });
  //   user.profileImage = req.file.filename;
  //   await user.save();

  //   // Redirect to profile page
  //   res.redirect('/profile');
  // } catch (error) {
  //   console.error('Error uploading file:', error);
  //   res.status(500).send('Error uploading file.');
  // }
})

//add dp of profile
router.get('/add', isLoggedIn, async function (req, res, next) {

  const user = await usermodel.findOne({ username: req.session.passport.user });

  res.render('add', { user, nav: true });
})

//create a post-board
router.post('/createpost', isLoggedIn, upload.single('postimage'), async function (req, res, next) {
  if (!req.file) {
    return res.status(400).send('No file Selected');
  }

  const user = await usermodel.findOne({ username: req.session.passport.user });

  const postdata = await postmodel.create({
    userid: user._id,
    image: req.file.filename,
    title: req.body.title,
    description: req.body.postdescription
  })

  user.postid.push(postdata._id);
  await user.save();

  // res.send('done');
  res.redirect('/profile');
})

//open board to check all pins in that board
router.get('/show/posts', isLoggedIn, async function (req, res, next) {

  const user = await usermodel
    .findOne({ username: req.session.passport.user })
    .populate('postid')

  res.render('show', { user, nav: true });
})

// feed - where we can see all user posts
router.get('/feed', isLoggedIn, async function (req, res, next) {

  const user = await usermodel.findOne({ username: req.session.passport.user });
  const posts = await postmodel.find().populate('userid');

  res.render('feed', { user, posts, nav: true });
})

module.exports = router;
