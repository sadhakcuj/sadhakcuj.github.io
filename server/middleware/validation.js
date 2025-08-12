const Joi = require('joi');

// Validation schemas for each step
const step1Schema = Joi.object({
  aadhaar_number: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
      'string.pattern.base': 'Aadhaar number must be exactly 12 digits',
      'any.required': 'Aadhaar number is required'
    }),
  mobile_number: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be 10 digits starting with 6, 7, 8, or 9',
      'any.required': 'Mobile number is required'
    }),
  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'OTP must be exactly 6 digits',
      'any.required': 'OTP is required'
    })
});

const step2Schema = Joi.object({
  pan_number: Joi.string()
    .pattern(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/)
    .required()
    .messages({
      'string.pattern.base': 'PAN number must be in format ABCDE1234F',
      'any.required': 'PAN number is required'
    }),
  business_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Business name must be at least 2 characters long',
      'string.max': 'Business name cannot exceed 100 characters',
      'any.required': 'Business name is required'
    }),
  business_type: Joi.string()
    .valid('proprietorship', 'partnership', 'private_limited', 'public_limited', 'llp', 'other')
    .required()
    .messages({
      'any.only': 'Please select a valid business type',
      'any.required': 'Business type is required'
    }),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Pincode must be exactly 6 digits',
      'any.required': 'Pincode is required'
    }),
  city: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'City name must be at least 2 characters long',
      'string.max': 'City name cannot exceed 50 characters',
      'any.required': 'City is required'
    }),
  state: Joi.string()
    .valid(
      'andhra_pradesh', 'arunachal_pradesh', 'assam', 'bihar', 'chhattisgarh',
      'goa', 'gujarat', 'haryana', 'himachal_pradesh', 'jharkhand', 'karnataka',
      'kerala', 'madhya_pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
      'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil_nadu',
      'telangana', 'tripura', 'uttar_pradesh', 'uttarakhand', 'west_bengal',
      'delhi', 'jammu_kashmir', 'ladakh', 'chandigarh', 'daman_diu',
      'dadra_nagar_haveli', 'puducherry', 'andaman_nicobar', 'lakshadweep'
    )
    .required()
    .messages({
      'any.only': 'Please select a valid state',
      'any.required': 'State is required'
    })
});

// Main validation middleware
const validateFormData = (req, res, next) => {
  try {
    const { step, data } = req.body;

    if (!step || !data) {
      return res.status(400).json({
        success: false,
        error: 'Step and data are required'
      });
    }

    let validationResult;
    let schema;

    switch (parseInt(step)) {
      case 1:
        schema = step1Schema;
        break;
      case 2:
        schema = step2Schema;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid step number. Must be 1 or 2.'
        });
    }

    validationResult = schema.validate(data, { abortEarly: false });

    if (validationResult.error) {
      const errors = validationResult.error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Validation passed
    req.validatedData = validationResult.value;
    next();
  } catch (error) {
    console.error('Validation middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation error occurred'
    });
  }
};

// Field-level validation function
const validateField = (fieldName, value, fieldType) => {
  const validations = {
    aadhaar_number: {
      pattern: /^[0-9]{12}$/,
      message: 'Aadhaar number must be exactly 12 digits'
    },
    mobile_number: {
      pattern: /^[6-9][0-9]{9}$/,
      message: 'Mobile number must be 10 digits starting with 6, 7, 8, or 9'
    },
    otp: {
      pattern: /^[0-9]{6}$/,
      message: 'OTP must be exactly 6 digits'
    },
    pan_number: {
      pattern: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
      message: 'PAN number must be in format ABCDE1234F'
    },
    pincode: {
      pattern: /^[0-9]{6}$/,
      message: 'Pincode must be exactly 6 digits'
    },
    business_name: {
      minLength: 2,
      maxLength: 100,
      message: 'Business name must be between 2 and 100 characters'
    },
    city: {
      minLength: 2,
      maxLength: 50,
      message: 'City name must be between 2 and 50 characters'
    }
  };

  const validation = validations[fieldName];
  if (!validation) {
    return { isValid: true, message: 'Field validation not configured' };
  }

  // Pattern validation
  if (validation.pattern) {
    const isValid = validation.pattern.test(value);
    return {
      isValid,
      message: isValid ? 'Valid' : validation.message
    };
  }

  // Length validation
  if (validation.minLength || validation.maxLength) {
    const length = value.length;
    const isValid = (!validation.minLength || length >= validation.minLength) &&
                   (!validation.maxLength || length <= validation.maxLength);
    
    return {
      isValid,
      message: isValid ? 'Valid' : validation.message
    };
  }

  // Required validation
  if (fieldType === 'required' && !value) {
    return {
      isValid: false,
      message: 'This field is required'
    };
  }

  return { isValid: true, message: 'Valid' };
};

module.exports = {
  validateFormData,
  validateField
}; 