const mongoose = require('mongoose');
const Profile = require('../models/Profile');

const getProfileById = async (req, res, next) => {
  try {
    const profileId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).send('Invalid profile ID');
    }

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).send('Profile not found');
    }

    res.render('profile_template', {
      profile: profile,
    });
  } catch (error) {
    next(error);
  }
};


const createProfile = async (req, res, next) => {
  try {
    const newProfile = req.body;
    const createdProfile = await Profile.create(newProfile);
    res.status(201).json(createdProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfileById,
  createProfile,
};
