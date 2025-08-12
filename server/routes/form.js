const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { validateFormData } = require('../middleware/validation');
const { rateLimit } = require('express-rate-limit');

const prisma = new PrismaClient();

// Rate limiting for form submissions
const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 form submissions per windowMs
  message: 'Too many form submissions from this IP, please try again later.'
});

// Get form schema (from scraped data)
router.get('/schema', async (req, res) => {
  try {
    // This would typically come from the scraped data
    // For now, we'll return a mock schema based on Udyam requirements
    const formSchema = {
      steps: [
        {
          id: 1,
          title: "Aadhaar + OTP Validation",
          description: "First step of Udyam registration process",
          fields: [
            {
              id: "aadhaar_number",
              name: "aadhaar_number",
              label: "Aadhaar Number",
              type: "text",
              required: true,
              pattern: "[0-9]{12}",
              maxLength: 12,
              placeholder: "Enter 12-digit Aadhaar number",
              validation: {
                type: "aadhaar",
                message: "Please enter a valid 12-digit Aadhaar number"
              }
            },
            {
              id: "mobile_number",
              name: "mobile_number",
              label: "Mobile Number",
              type: "text",
              required: true,
              pattern: "[0-9]{10}",
              maxLength: 10,
              placeholder: "Enter 10-digit mobile number",
              validation: {
                type: "mobile",
                message: "Please enter a valid 10-digit mobile number"
              }
            },
            {
              id: "otp",
              name: "otp",
              label: "OTP",
              type: "text",
              required: true,
              pattern: "[0-9]{6}",
              maxLength: 6,
              placeholder: "Enter 6-digit OTP",
              validation: {
                type: "otp",
                message: "Please enter a valid 6-digit OTP"
              }
            }
          ]
        },
        {
          id: 2,
          title: "PAN Validation",
          description: "Second step of Udyam registration process",
          fields: [
            {
              id: "pan_number",
              name: "pan_number",
              label: "PAN Number",
              type: "text",
              required: true,
              pattern: "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}",
              maxLength: 10,
              placeholder: "Enter PAN number (e.g., ABCDE1234F)",
              validation: {
                type: "pan",
                message: "Please enter a valid PAN number"
              }
            },
            {
              id: "business_name",
              name: "business_name",
              label: "Business Name",
              type: "text",
              required: true,
              maxLength: 100,
              placeholder: "Enter business/enterprise name",
              validation: {
                type: "required",
                message: "Business name is required"
              }
            },
            {
              id: "business_type",
              name: "business_type",
              label: "Type of Business",
              type: "select",
              required: true,
              options: [
                { value: "proprietorship", text: "Proprietorship" },
                { value: "partnership", text: "Partnership" },
                { value: "private_limited", text: "Private Limited Company" },
                { value: "public_limited", text: "Public Limited Company" },
                { value: "llp", text: "Limited Liability Partnership" },
                { value: "other", text: "Other" }
              ],
              validation: {
                type: "required",
                message: "Please select business type"
              }
            },
            {
              id: "pincode",
              name: "pincode",
              label: "Pincode",
              type: "text",
              required: true,
              pattern: "[0-9]{6}",
              maxLength: 6,
              placeholder: "Enter 6-digit pincode",
              validation: {
                type: "pincode",
                message: "Please enter a valid 6-digit pincode"
              }
            },
            {
              id: "city",
              name: "city",
              label: "City",
              type: "text",
              required: true,
              maxLength: 50,
              placeholder: "Enter city name",
              validation: {
                type: "required",
                message: "City is required"
              }
            },
            {
              id: "state",
              name: "state",
              label: "State",
              type: "select",
              required: true,
              options: [
                { value: "andhra_pradesh", text: "Andhra Pradesh" },
                { value: "arunachal_pradesh", text: "Arunachal Pradesh" },
                { value: "assam", text: "Assam" },
                { value: "bihar", text: "Bihar" },
                { value: "chhattisgarh", text: "Chhattisgarh" },
                { value: "goa", text: "Goa" },
                { value: "gujarat", text: "Gujarat" },
                { value: "haryana", text: "Haryana" },
                { value: "himachal_pradesh", text: "Himachal Pradesh" },
                { value: "jharkhand", text: "Jharkhand" },
                { value: "karnataka", text: "Karnataka" },
                { value: "kerala", text: "Kerala" },
                { value: "madhya_pradesh", text: "Madhya Pradesh" },
                { value: "maharashtra", text: "Maharashtra" },
                { value: "manipur", text: "Manipur" },
                { value: "meghalaya", text: "Meghalaya" },
                { value: "mizoram", text: "Mizoram" },
                { value: "nagaland", text: "Nagaland" },
                { value: "odisha", text: "Odisha" },
                { value: "punjab", text: "Punjab" },
                { value: "rajasthan", text: "Rajasthan" },
                { value: "sikkim", text: "Sikkim" },
                { value: "tamil_nadu", text: "Tamil Nadu" },
                { value: "telangana", text: "Telangana" },
                { value: "tripura", text: "Tripura" },
                { value: "uttar_pradesh", text: "Uttar Pradesh" },
                { value: "uttarakhand", text: "Uttarakhand" },
                { value: "west_bengal", text: "West Bengal" },
                { value: "delhi", text: "Delhi" },
                { value: "jammu_kashmir", text: "Jammu & Kashmir" },
                { value: "ladakh", text: "Ladakh" },
                { value: "chandigarh", text: "Chandigarh" },
                { value: "daman_diu", text: "Daman & Diu" },
                { value: "dadra_nagar_haveli", text: "Dadra & Nagar Haveli" },
                { value: "puducherry", text: "Puducherry" },
                { value: "andaman_nicobar", text: "Andaman & Nicobar Islands" },
                { value: "lakshadweep", text: "Lakshadweep" }
              ],
              validation: {
                type: "required",
                message: "Please select state"
              }
            }
          ]
        }
      ]
    };

    res.json({
      success: true,
      data: formSchema
    });
  } catch (error) {
    console.error('Error fetching form schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch form schema'
    });
  }
});

// Submit form data
router.post('/submit', formSubmissionLimiter, validateFormData, async (req, res) => {
  try {
    const { step, data } = req.body;

    // Store form data in database
    const formSubmission = await prisma.formSubmission.create({
      data: {
        step: step,
        formData: data,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'submitted'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: formSubmission.id,
        step: formSubmission.step,
        submittedAt: formSubmission.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit form'
    });
  }
});

// Get form submission by ID
router.get('/submission/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const submission = await prisma.formSubmission.findUnique({
      where: { id: parseInt(id) }
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Form submission not found'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission'
    });
  }
});

// Get all form submissions (for admin purposes)
router.get('/submissions', async (req, res) => {
  try {
    const { page = 1, limit = 10, step } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (step) {
      where.step = parseInt(step);
    }

    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.formSubmission.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
});

module.exports = router; 