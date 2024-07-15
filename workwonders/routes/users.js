var express = require('express');
var router = express.Router();
var userModel = require('../model/user');
const session = require('../session');
const bcrypt = require('bcrypt');
const axios = require('axios');

const loginAttempts = {};


router.get('/userslist', function (req, res, next) {
  result = userModel.readall(function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
    //res.send(result);
  });
});


router.get('/create_account', function (req, res, next) {
  res.render('create_account');
});

router.post('/create_account', function (req, res, next) {
  var { email, name, firstName, pwd, phone, confirm_pwd, remember_me } = req.body;
  if (pwd !== confirm_pwd) {
    return res.status(400).send('Les mots de passe ne correspondent pas');
  }

  bcrypt.hash(pwd, 10, function (err, hashedPassword) {
    if (err) {
      return next(err);
    }
    userModel.create(email, name, firstName, hashedPassword, phone, function (result) {
      if (remember_me) {
        res.cookie('remember_me', 'true', { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
      }
      res.redirect('/users/login');
    });
  });
});

router.get('/changePassword', function (req, res, next) {
  res.render('changePassword'); // Render the change password page
});

router.post('/changePassword', function (req, res, next) {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.session.user_id;

  // Check if the new passwords match
  if (newPassword !== confirmPassword) {
    return res.render('changePassword', { error: 'New passwords do not match' });
  }

  // Find the user by ID
  userModel.findById(userId, function (err, user) {
    if (err || !user) {
      return res.render('changePassword', { error: 'User not found' });
    }

    // Compare current password with stored password
    bcrypt.compare(currentPassword, user.password, function (err, isMatch) {
      if (err || !isMatch) {
        return res.render('changePassword', { error: 'Current password is incorrect' });
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, function (err, hashedPassword) {
        if (err) {
          return res.render('changePassword', { error: 'Error hashing the new password' });
        }

        // Update the user's password in the database
        userModel.updatePassword(userId, hashedPassword, function (err, result) {
          if (err) {
            return res.render('changePassword', { error: 'Error updating the password' });
          }

          res.redirect('/homes');
        });
      });
    });
  });
});

router.get('/login', function (req, res, next) {
  res.render('login', { users: null });
});

router.post('/login', async function (req, res, next) {
  const { email, password, rememberMe, 'g-recaptcha-response': recaptchaToken } = req.body;

  // Initialize login attempt tracking
  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0, lastAttempt: Date.now() };
  }

  // Check if account is locked
  const timeSinceLastAttempt = Date.now() - loginAttempts[email].lastAttempt;
  if (loginAttempts[email].count >= 5 && timeSinceLastAttempt < 15 * 60 * 1000) { // 15 minutes lockout
    return res.render('login', { error: 'Too many failed attempts. Try again later.' });
  }

  if (timeSinceLastAttempt >= 15 * 60 * 1000) {
    loginAttempts[email] = { count: 0, lastAttempt: Date.now() }; // Reset after lockout period
  }

  if (email === "i@love.doom") { // Easter egg
    return res.render("creepy");
  }

  // Verify reCAPTCHA token
  const secretKey = '6LeV9_cpAAAAALtjcikSlMgMxRcdy1Z666VcyvZA';
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    const recaptchaResponse = await fetch(recaptchaUrl, {
      method: 'POST'
    });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.render('login', { error: 'reCAPTCHA verification failed. Please try again.' });
    }
  } catch (err) {
    console.error('Error verifying reCAPTCHA:', err);
    return res.render('login', { error: 'Error verifying reCAPTCHA. Please try again.' });
  }

  console.log("Step 1: Starting user login process");

  userModel.findByEmail(email, function (err, user) {
    console.log("Step 2: Checking if user exists");
    if (err) {
      console.error("Error fetching user by email:", err);
      return res.render('login', { error: 'Something went wrong. Please try again.' });
    }
    if (!user) {
      console.log("No user found with the provided email");
      loginAttempts[email].count++;
      loginAttempts[email].lastAttempt = Date.now();
      return res.render('login', { error: 'Invalid email or password' });
    }

    console.log("Step 3: Comparing passwords");

    bcrypt.compare(password, user.password, function (err, isMatch) {
      console.log("Step 4: Password comparison result");
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.render('login', { error: 'Something went wrong. Please try again.' });
      }
      if (!isMatch) {
        console.log("Passwords do not match");
        loginAttempts[email].count++;
        loginAttempts[email].lastAttempt = Date.now();
        return res.render('login', { error: 'Invalid email or password' });
      }

      console.log("Step 5: Passwords match, creating session");

      // Reset login attempts on successful login
      loginAttempts[email] = { count: 0, lastAttempt: Date.now() };

      // User is valid, create a session and redirect to dashboard
      session.creatSession(req.session, email, user.role, user.id);

      if (rememberMe) {
        // Set a persistent cookie for 30 days
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        console.log("Setting persistent cookie for 30 days");
      } else {
        // Set session cookie for the current session only
        req.session.cookie.expires = false;
        console.log("Setting session cookie for current session only");
      }

      res.redirect('/homes');
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/users/login');
    }
  });
});



router.get('/editProfile', function (req, res) {
  userModel.read(req.session.user_mail, function (result) {
    res.render('editProfile', { user: result[0] });
  });
});

router.post('/updateProfile', function (req, res) {
  const userId = req.session.user_id;
  const updatedUserData = req.body;
  userModel.update(userId, updatedUserData, function (result) {
    res.redirect('/homes');
  });
});



module.exports = router;