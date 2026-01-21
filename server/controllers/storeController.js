const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');

// --- Define Functions First ---

const getAllStores = async (req, res) => {
  try {
    const { search, sort } = req.query;
    
    // Search Logic
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // Sort Logic
    let orderClause = [['rating', 'DESC']]; 
    if (sort === 'name_asc') orderClause = [['name', 'ASC']];
    if (sort === 'name_desc') orderClause = [['name', 'DESC']];

    const stores = await Store.findAll({
      where: whereClause,
      order: orderClause,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};

const addStore = async (req, res) => {
  try {
    const { name, address, email, ownerEmail } = req.body;

    const owner = await User.findOne({ where: { email: ownerEmail } });
    if (!owner) {
      return res.status(404).json({ error: "Store Owner not found." });
    }

    const newStore = await Store.create({
      name,
      address,
      email,
      ownerId: owner.id,
      rating: 0
    });

    res.status(201).json({ message: "Store created successfully", store: newStore });
  } catch (err) {
    console.error("Error adding store:", err);
    res.status(500).json({ error: "Failed to create store" });
  }
};

const rateStore = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id; 

    await Rating.create({ storeId, userId, rating });

    const ratings = await Rating.findAll({ where: { storeId } });
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = total / ratings.length;

    await Store.update({ rating: avgRating }, { where: { id: storeId } });

    res.json({ message: "Rating submitted", avgRating });
  } catch (err) {
    console.error("Error submitting rating:", err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
};

const getMyStore = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const store = await Store.findOne({ where: { ownerId } });
        
        if (!store) return res.status(404).json({ error: "No store found" });

        const ratings = await Rating.findAll({
            where: { storeId: store.id },
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        const users = ratings.map(r => r.User);

        res.json({ store, users });
    } catch (err) {
        console.error("Error fetching my store:", err);
        res.status(500).json({ error: "Failed to fetch store data" });
    }
};

// --- Export All Together ---
module.exports = {
  getAllStores,
  addStore,
  rateStore,
  getMyStore
};