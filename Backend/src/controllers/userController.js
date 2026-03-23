const User = require("../models/User");

const bcrypt = require("bcryptjs");


exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    );

   res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    //  MUST include password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // prevent same password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different",
      });
    }

    //  update password (auto hashed by your model)
    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};