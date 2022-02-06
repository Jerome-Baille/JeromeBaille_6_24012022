const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const User = require('../models/User');


// Create a schema for the passwords
var schemaPassword = new passwordValidator();

// Add properties to it
schemaPassword
.is().min(8)                    // Minimum length 8
.is().max(100)                  // Maximum length 100
.has().uppercase()              // Must have uppercase letters
.has().lowercase()              // Must have lowercase letters
.has().digits(1)                // Must have at least 1 digit


exports.signup = (req, res, next) => {
  if (schemaPassword.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10) // The password is encrypted with 10 salt rounds
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caractères et être composé d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`});
  }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error : `Nous n'avons pas trouvé de compte correspondant à l'adresse e-mail renseignée.` });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error : `Le mot de passe renseigné est incorrect.` });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.TOKEN,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};