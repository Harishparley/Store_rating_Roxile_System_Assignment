const Rating = require('../models/Rating');
const Store = require('../models/Store');
const User = require('../models/User'); 
const { Op } = require('sequelize'); 
const Joi = require('joi');

// Validation Schema
const storeSchema = Joi.object({
  name: Joi.string().required().max(60),
  email: Joi.string().email().required(),
  address: Joi.string().required().max(400),
  ownerEmail: Joi.string().email().required() // FIXED: Admin must provide owner's email
});

exports.addStore = async (req, res) => {
  try {
    // 1. Validate Input
    const { error } = storeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, address, ownerEmail } = req.body;

    // 2. Find the Store Owner by Email (FIXED LOGIC)
    const owner = await User.findOne({ where: { email: ownerEmail } });
    
    if (!owner) {
      return res.status(404).json({ error: "Store Owner with this email not found. Create the user first." });
    }

    // Optional: Check if the user is actually a 'store_owner'
    // if (owner.role !== 'store_owner' && owner.role !== 'owner') {
    //   return res.status(400).json({ error: "This user is not a Store Owner." });
    // }

    // 3. Create Store linked to the Owner
    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId: owner.id // Link the store to the user
    });

    res.status(201).json({ message: "Store created successfully", store: newStore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create store" });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id; 

    // Validate Rating Range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // 1. Check if user already rated this store
    const existingRating = await Rating.findOne({ where: { userId, storeId } });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      // Create new rating
      await Rating.create({ userId, storeId, rating });
    }

    // 2. Recalculate Average Rating for the Store
    const allRatings = await Rating.findAll({ where: { storeId } });
    const totalScore = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const average = totalScore / allRatings.length;

    // 3. Update Store Record
    await Store.update({ rating: average }, { where: { id: storeId } });

    res.json({ message: "Rating submitted", currentAverage: average });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const { search, sort } = req.query;
    
    let queryOptions = {
      where: {},
      include: [
         // Include owner details (Optional but useful for frontend)
        { model: User, attributes: ['name', 'email'] }
      ],
      order: []
    };

    // 1. Search Logic (Name OR Address)
    if (search) {
      queryOptions.where = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // 2. Sorting Logic
    if (sort === 'name_asc') {
      queryOptions.order.push(['name', 'ASC']);
    } else if (sort === 'name_desc') {
      queryOptions.order.push(['name', 'DESC']);
    } else {
      // Default: Highest Rated First
      queryOptions.order.push(['rating', 'DESC']); 
    }

    const stores = await Store.findAll(queryOptions);
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    // 1. Find the store that belongs to this logged-in User
    const store = await Store.findOne({ where: { ownerId } });

    if (!store) {
      return res.status(404).json({ error: "No store found for this account." });
    }

    // 2. Find all ratings for this specific store
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        { model: User, attributes: ['name', 'email'] } // Include info of the user who rated
      ]
    });

    res.json({
      storeName: store.name,
      averageRating: store.rating,
      ratings: ratings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
};