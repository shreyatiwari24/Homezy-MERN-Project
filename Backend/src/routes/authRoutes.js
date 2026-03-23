const express = require("express");
const router = express.Router();


// ================= CONTROLLERS =================

const {
registerUser,
loginUser,
verifyEmail
} = require("../controllers/authController");


// ================= MIDDLEWARE =================

const validate =
require("../middlewares/validate");

const {
protect,
authorize
} = require("../middlewares/authMiddleware");


// ================= VALIDATIONS =================

const {
registerValidation,
loginValidation
} =
require("../validations/authValidation");



/* =================================================
                PUBLIC ROUTES
================================================= */


/* ---------- REGISTER ---------- */

router.post(
"/register",
...registerValidation,
validate,
registerUser
);


/* ---------- LOGIN ---------- */

router.post(
"/login",
loginValidation,
validate,
loginUser
);


/* ---------- EMAIL VERIFY ---------- */

router.get(
"/verify-email/:token",
verifyEmail
);




/* =================================================
              AUTHENTICATED ROUTES
================================================= */


/* ---------- CURRENT USER ---------- */

router.get(
"/me",
protect,
async (req,res)=>{

res.json({

success:true,

user:{
id:req.user._id,
name:req.user.name,
email:req.user.email,
role:req.user.role

}

});

}
);




/* ---------- ADMIN ACCESS ---------- */

router.get(
"/admin-only",
protect,
authorize("admin"),
(req,res)=>{

res.json({

success:true,
message:"Admin access granted"

});

}
);



module.exports = router;



