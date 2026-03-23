const { body } = require("express-validator");


/* =====================================
        REGISTER VALIDATION
===================================== */

exports.registerValidation = [

/* ---------- NAME ---------- */

body("name")
.trim()
.notEmpty()
.withMessage("Name is required")
.isLength({ min: 2, max: 50 })
.withMessage("Name must be 2–50 characters"),



/* ---------- EMAIL ---------- */

body("email")
.trim()
.isEmail()
.withMessage("Valid email required")
.normalizeEmail(),



/* ---------- PASSWORD ---------- */

body("password")
.isLength({ min: 6 })
.withMessage("Password must be at least 6 characters")
.matches(/[A-Z]/)
.withMessage("Password must contain one uppercase letter")
.matches(/[0-9]/)
.withMessage("Password must contain one number"),



/* ---------- ROLE SAFE ---------- */

body("role")
.optional()
.isIn(["customer", "provider"])
.withMessage("Invalid role"),



/* ---------- PHONE ---------- */

body("phone")
.optional()
.isMobilePhone("any")
.withMessage("Invalid phone number"),



/* ---------- PROVIDER VALIDATION ---------- */

body("category")
.if(body("role").equals("provider"))
.notEmpty()
.withMessage("Service category required"),


body("experience")
.if(body("role").equals("provider"))
.optional()
.isNumeric()
.withMessage("Experience must be number"),


body("rate")
.if(body("role").equals("provider"))
.optional()
.isNumeric()
.withMessage("Rate must be numeric"),


body("city")
.if(body("role").equals("provider"))
.optional()
.trim()
.isLength({ min: 2 })
.withMessage("City required"),

];



/* =====================================
          LOGIN VALIDATION
===================================== */

exports.loginValidation = [

body("email")
.trim()
.isEmail()
.withMessage("Valid email required")
.normalizeEmail(),

body("password")
.notEmpty()
.withMessage("Password is required"),


body("role")
.optional()
.isIn(["customer","provider","admin"])
.withMessage("Invalid login portal")

];



