const Rating = require('../models/Rating');
const Store = require('../models/Store');
const Joi = require('joi');

// Validation for adding a store
const storeSchema = Joi.object({
  name: Joi.string().required().max(60),
  email: Joi.string().email().required(),
  address: Joi.string().required().max(400)
});

exports.addStore = async (req, res) => {
  try {
    // 1. Validate Input
    const { error } = storeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // 2. Create Store
    const newStore = await Store.create(req.body);

    res.status(201).json({ message: "Store created successfully", store: newStore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create store" });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id; // From the token

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be 1-5" });
    }

    // 1. Create or Update the Rating
    // We search if this user already rated this store
    const existingRating = await Rating.findOne({ where: { userId, storeId } });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({ userId, storeId, rating });
    }

    // 2. Recalculate Average for the Store
    const allRatings = await Rating.findAll({ where: { storeId } });
    const totalScore = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const average = totalScore / allRatings.length;

    // 3. Update Store table
    await Store.update({ rating: average }, { where: { id: storeId } });

    res.json({ message: "Rating submitted", currentAverage: average });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    // We want to sort stores by rating (highest first)
    // We also include the 'attributes' to control what data we send
    const stores = await Store.findAll({
      order: [['rating', 'DESC']], // Sort by 5 stars -> 0 stars
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};