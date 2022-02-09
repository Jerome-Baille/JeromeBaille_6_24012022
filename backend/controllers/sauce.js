const Sauce = require('../models/Sauce');
const fs = require('fs');

// Create the sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
      .then(()=> res.status(201).json({message : "Objet Enregistré"}))
      .catch(error => res.status(400).json({error}));
}

// Read the sauce(s)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) =>{
  Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({error}));
};

// Update the Sauce
exports.updateSauce = (req, res, next) =>{
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        const sauceObject = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        }
        Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json("Objet modifié !"))
        .catch(error => res.status(400).json({error}));
      })
    })
    .catch(error => res.status(500).json({ error }));
  } else {
    const sauceObject = { ...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json("Objet modifié !"))
        .catch(error => res.status(400).json({error}));
  }
}

// Delete the sauce
exports.deleteSauce = (req, res, next) =>{
  Sauce.findOne({_id: req.params.id})
      .then(sauce => {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({ _id : req.params.id})
                  .then(() => res.status(200).json("Objet supprimé !"))
                  .catch(error => res.status(400).json({error}));
          });
      })    
      .catch(error => res.status(500).json({error}));
}



// Like or Dislike a sauce
exports.likeSauces = (req, res, next) => {
    if (req.body.like === 1) { 
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } }) 
        .then(() => res.status(200).json({ message: `J'aime cette sauce !` }))
        .catch(error => res.status(400).json({ error }))
    } else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
        .then(() => res.status(200).json({ message: `Je n'aime pas cette sauce !` }))
        .catch(error => res.status(400).json({ error }))
    } else {
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: `J'annule mon vote` }))
              .catch(error => res.status(400).json({ error }))
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
              .then(() => res.status(200).json({ message: `J'annule mon vote` }))
              .catch(error => res.status(400).json({ error }))
          }
        })
        .catch(error => res.status(400).json({ error }))
    }
}