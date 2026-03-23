const User = require("../models/User");


// SAVE PROVIDER
exports.saveProvider = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user.savedProviders.includes(req.params.providerId)) {
      user.savedProviders.push(req.params.providerId);
      await user.save();
    }

    res.json({
      success: true,
      message: "Provider saved successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// REMOVE SAVED PROVIDER
exports.removeSavedProvider = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    user.savedProviders = user.savedProviders.filter(
      id => id.toString() !== req.params.providerId
    );

    await user.save();

    res.json({
      success: true,
      message: "Provider removed"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// GET SAVED PROVIDERS
exports.getSavedProviders = async (req, res) => {

  try {

    const user = await User.findById(req.user._id)
      .populate("savedProviders", "name email");

    res.json({
      success: true,
      providers: user.savedProviders
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};