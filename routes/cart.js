const express = require("express");
const User = require("../models/User");
const Product = require('../models/product')
const router = express.Router();

router.post("/addToCart", async (req, res) => {
  console.log(req.body, req.user);

  const userData = await User.findOne({ _id: req.user._id });
  // Initialize cartData if it doesn't exist
  if (!userData.cartData) {
    userData.cartData = {};
  }

  // Initialize the item count if it doesn't exist, then increment
  if (userData.cartData[req.body.itemId] === undefined) {
    userData.cartData[req.body.itemId] = 1;
  } else {
    userData.cartData[req.body.itemId] += 1;
  }


  // userData.cartData[req.body.itemId] += 1;
  const result = await User.findOneAndUpdate(
    { _id: req.user._id },
    { cartData: userData.cartData },
    { new: true }
  );

  const cartItemsDetails = await Promise.all(
    Object.entries(result.cartData).map(async ([itemId, quantity]) => {
      const product = await Product.findById(itemId);
      return {
        _id: itemId,
        quantity,
        productName: product.name, // Adjust field name if different in your Product model
        image: product.image,      // Adjust field name if different
        price: product.price       // Adjust field name if different
      };
    })
  );

  res.json({ success: 1, cartData: cartItemsDetails });
});


router.post("/removeFromCart", async (req, res) => {
  //  console.log(req.body, req.user);
  const { itemId } = req.body;
  const userData = await User.findOne({ _id: req.user._id });

  if (userData.cartData[itemId] <= 1) {
    // Remove the item from the cart
    delete userData.cartData[itemId];
  } else {
    // Decrement the item count
    userData.cartData[itemId] -= 1;
  }

  const result = await User.findOneAndUpdate(
    { _id: req.user._id },
    { cartData: userData.cartData }
  );

  res.json({ success: 1, result });
});

router.post("/removeItem", async (req, res) => {
  const { itemId } = req.body;
  
  try {
    const userData = await User.findOne({ _id: req.user._id });
    
    // Remove the item from the cart completely
    if (userData.cartData.hasOwnProperty(itemId)) {
      delete userData.cartData[itemId];
    }
    
    const result = await User.findOneAndUpdate(
      { _id: req.user._id },
      { cartData: userData.cartData },
      { new: true }
    );
    
    res.json({ success: 1, result });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: 0, message: "Error removing item from cart" });
  }
});


router.get('/getUserCart', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let populatedCartData = [];

    if (user.cartData && typeof user.cartData === 'object') {
      const productIds = Object.keys(user.cartData);

      const products = await Product.find({ _id: { $in: productIds } });

      const productMap = products.reduce((map, product) => {
        map[product._id.toString()] = product;
        return map;
      }, {});

      populatedCartData = productIds.map(productId => {
        const product = productMap[productId];
        return {
          _id: productId,
          productId: productId,
          quantity: user.cartData[productId],
          price: product ? product.price : 0,
          image: product ? product.image : '',
          productName: product ? product.productName : '',
          description: product ? product.description : '',
          category: product ? product.category : ''
        };
      });
    }

    console.log('User cart data:', populatedCartData);

    res.json({ success: true, cartData: populatedCartData });
  } catch (error) {
    console.error('Error in getUserCart:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});


module.exports = router;