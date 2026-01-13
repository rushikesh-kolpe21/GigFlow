const Joi = require('joi');

const signValidation = (req, res, next) => {
  // Align field names with frontend and enforce proper email format
  const emailRule = Joi.string()
    .trim()
    .email({ tlds: { allow: true }, minDomainSegments: 2 })
    // enforce lowercase only
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    // prevent consecutive dots and leading dot in local part
    .pattern(/^(?!.*\.\.)(?!\.)[^@\s]+@[^@\s]+\.[^@\s.]{2,}$/)
    .max(254)
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.pattern.base': 'Email must be in lowercase and valid format',
    });

    const passwordRule = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    "any.required": "Password is required",
  });

  const schema = Joi.object({
    firstName: Joi.string().min(1).max(101).required(),
    lastName: Joi.string().min(1).max(101).required(),
    email: emailRule.required(),
    password: passwordRule.required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    // Prefer friendly message; special-case uppercase letters in email
    const rawEmail = req.body?.email ?? '';
    const hasUppercase = /[A-Z]/.test(rawEmail);
    const msg = hasUppercase
      ? 'Email must be in lowercase letters only'
      : (error.details && error.details[0] && error.details[0].message) || 'Bad Request';
    return res.status(400).json({ message: msg, success: false });
  }
  next();
}

const loginValidation = (req, res, next)=>{
    // reuse email rule from signup validation
  const emailRule = Joi.string()
    .trim()
    .email({ tlds: { allow: true }, minDomainSegments: 2 })
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    .pattern(/^(?!.*\.\.)(?!\.)[^@\s]+@[^@\s]+\.[^@\s.]{2,}$/)
    .max(254)
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.pattern.base': 'Email must be in lowercase and valid format',
    });

    // password rule for login (less strict than signup)
      const passwordRule = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    "any.required": "Password is required",
  });


  const schema = Joi.object({
    email: emailRule.required(),
    password : passwordRule.required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const rawEmail = req.body?.email ?? '';
    const hasUppercase = /[A-Z]/.test(rawEmail);
    const msg = hasUppercase
      ? 'Email must be in lowercase letters only'
      : (error.details && error.details[0] && error.details[0].message) || 'Bad Request';
    return res.status(400).json({ message: msg, success: false });
  }
  next();
}
 
module.exports = {
    signValidation,
    loginValidation
}