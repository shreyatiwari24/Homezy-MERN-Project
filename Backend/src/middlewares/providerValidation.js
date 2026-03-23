const { body } = require("express-validator");

exports.validateProviderProfile = [

/* ---------- PHONE ---------- */

body("phone")
.optional()
.isMobilePhone("any")
.withMessage("Invalid phone number"),



/* ---------- CATEGORY ---------- */

body("category")
.optional()
.trim()
.isLength({ min: 3 })
.withMessage("Category required"),



/* ---------- EXPERIENCE ---------- */

body("experience")
.optional()
.isInt({ min: 0, max: 50 })
.withMessage(
"Experience must be 0-50 years"
),



/* ---------- RATE ---------- */

body("rate")
.optional()
.isFloat({ min: 0 })
.withMessage(
"Rate must be positive"
),



/* ---------- BIO ---------- */

body("bio")
.optional()
.trim()
.isLength({ max: 1000 })
.withMessage(
"Bio max 1000 characters"
),



/* ---------- CITY ---------- */

body("city")
.optional()
.trim()
.isLength({ min: 2 })
.withMessage("City required"),



/* ---------- ADDRESS ---------- */

body("address")
.optional()
.trim()
.isLength({ min: 5 })
.withMessage(
"Address too short"
),

];