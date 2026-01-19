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