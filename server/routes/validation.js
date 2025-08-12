const express = require('express');
const router = express.Router();
const { validateField } = require('../middleware/validation');

// Validate individual field
router.post('/field', async (req, res) => {
  try {
    const { fieldName, value, fieldType } = req.body;

    if (!fieldName || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Field name and value are required'
      });
    }

    const validationResult = validateField(fieldName, value, fieldType);

    res.json({
      success: true,
      data: validationResult
    });
  } catch (error) {
    console.error('Error validating field:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate field'
    });
  }
});

// Get city and state suggestions based on pincode
router.get('/pincode/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;

    // Validate pincode format
    if (!/^[0-9]{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pincode format. Please enter a 6-digit number.'
      });
    }

    // Mock API response - in production, this would call a real pincode API
    // You can integrate with APIs like PostPin, India Post, or other pincode services
    const pincodeData = await getPincodeData(pincode);

    if (!pincodeData) {
      return res.status(404).json({
        success: false,
        error: 'Pincode not found'
      });
    }

    res.json({
      success: true,
      data: pincodeData
    });
  } catch (error) {
    console.error('Error fetching pincode data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pincode data'
    });
  }
});

// Validate PAN number format
router.post('/pan', async (req, res) => {
  try {
    const { panNumber } = req.body;

    if (!panNumber) {
      return res.status(400).json({
        success: false,
        error: 'PAN number is required'
      });
    }

    // PAN format: ABCDE1234F (5 letters + 4 digits + 1 letter)
    const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
    const isValid = panRegex.test(panNumber);

    res.json({
      success: true,
      data: {
        isValid,
        message: isValid ? 'Valid PAN number' : 'Invalid PAN number format. Expected format: ABCDE1234F'
      }
    });
  } catch (error) {
    console.error('Error validating PAN:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate PAN'
    });
  }
});

// Validate Aadhaar number format
router.post('/aadhaar', async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber) {
      return res.status(400).json({
        success: false,
        error: 'Aadhaar number is required'
      });
    }

    // Aadhaar format: 12 digits
    const aadhaarRegex = /^[0-9]{12}$/;
    const isValid = aadhaarRegex.test(aadhaarNumber);

    res.json({
      success: true,
      data: {
        isValid,
        message: isValid ? 'Valid Aadhaar number' : 'Invalid Aadhaar number. Please enter 12 digits.'
      }
    });
  } catch (error) {
    console.error('Error validating Aadhaar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate Aadhaar'
    });
  }
});

// Validate mobile number format
router.post('/mobile', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number is required'
      });
    }

    // Mobile format: 10 digits starting with 6, 7, 8, or 9
    const mobileRegex = /^[6-9][0-9]{9}$/;
    const isValid = mobileRegex.test(mobileNumber);

    res.json({
      success: true,
      data: {
        isValid,
        message: isValid ? 'Valid mobile number' : 'Invalid mobile number. Please enter 10 digits starting with 6, 7, 8, or 9.'
      }
    });
  } catch (error) {
    console.error('Error validating mobile number:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate mobile number'
    });
  }
});

// Validate OTP format
router.post('/otp', async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        error: 'OTP is required'
      });
    }

    // OTP format: 6 digits
    const otpRegex = /^[0-9]{6}$/;
    const isValid = otpRegex.test(otp);

    res.json({
      success: true,
      data: {
        isValid,
        message: isValid ? 'Valid OTP' : 'Invalid OTP. Please enter 6 digits.'
      }
    });
  } catch (error) {
    console.error('Error validating OTP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate OTP'
    });
  }
});

// Mock function to get pincode data
async function getPincodeData(pincode) {
  // This is a mock implementation
  // In production, you would integrate with a real pincode API
  
  const mockPincodeData = {
    "110001": {
      "pincode": "110001",
      "city": "New Delhi",
      "state": "Delhi",
      "district": "New Delhi",
      "area": "Connaught Place"
    },
    "400001": {
      "pincode": "400001",
      "city": "Mumbai",
      "state": "Maharashtra",
      "district": "Mumbai City",
      "area": "Fort"
    },
    "700001": {
      "pincode": "700001",
      "city": "Kolkata",
      "state": "West Bengal",
      "district": "Kolkata",
      "area": "BBD Bagh"
    },
    "600001": {
      "pincode": "600001",
      "city": "Chennai",
      "state": "Tamil Nadu",
      "district": "Chennai",
      "area": "Chennai GPO"
    },
    "500001": {
      "pincode": "500001",
      "city": "Hyderabad",
      "state": "Telangana",
      "district": "Hyderabad",
      "area": "Abids"
    }
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return mockPincodeData[pincode] || null;
}

module.exports = router; 