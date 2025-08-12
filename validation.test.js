const { validateFormData, validateField } = require('../middleware/validation');

describe('Form Validation Tests', () => {
  describe('validateField', () => {
    test('should validate Aadhaar number correctly', () => {
      const result = validateField('aadhaar_number', '123456789012', 'required');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Valid');
    });

    test('should reject invalid Aadhaar number', () => {
      const result = validateField('aadhaar_number', '12345678901', 'required');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Aadhaar number must be exactly 12 digits');
    });

    test('should validate PAN number correctly', () => {
      const result = validateField('pan_number', 'ABCDE1234F', 'required');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Valid');
    });

    test('should reject invalid PAN number', () => {
      const result = validateField('pan_number', 'ABCD1234F', 'required');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('PAN number must be in format ABCDE1234F');
    });

    test('should validate mobile number correctly', () => {
      const result = validateField('mobile_number', '9876543210', 'required');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Valid');
    });

    test('should reject invalid mobile number', () => {
      const result = validateField('mobile_number', '1234567890', 'required');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Mobile number must be 10 digits starting with 6, 7, 8, or 9');
    });

    test('should validate pincode correctly', () => {
      const result = validateField('pincode', '123456', 'required');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Valid');
    });

    test('should reject invalid pincode', () => {
      const result = validateField('pincode', '12345', 'required');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Pincode must be exactly 6 digits');
    });

    test('should validate business name length', () => {
      const result = validateField('business_name', 'Test Business', 'required');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Valid');
    });

    test('should reject short business name', () => {
      const result = validateField('business_name', 'A', 'required');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Business name must be between 2 and 100 characters');
    });

    test('should validate required field', () => {
      const result = validateField('business_name', '', 'required');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('This field is required');
    });
  });

  describe('validateFormData', () => {
    test('should validate step 1 data correctly', () => {
      const req = {
        body: {
          step: 1,
          data: {
            aadhaar_number: '123456789012',
            mobile_number: '9876543210',
            otp: '123456'
          }
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateFormData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedData).toBeDefined();
    });

    test('should reject invalid step 1 data', () => {
      const req = {
        body: {
          step: 1,
          data: {
            aadhaar_number: '12345678901', // Invalid
            mobile_number: '9876543210',
            otp: '123456'
          }
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateFormData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'aadhaar_number',
            message: expect.stringContaining('Aadhaar number must be exactly 12 digits')
          })
        ])
      });
    });

    test('should validate step 2 data correctly', () => {
      const req = {
        body: {
          step: 2,
          data: {
            pan_number: 'ABCDE1234F',
            business_name: 'Test Business',
            business_type: 'proprietorship',
            pincode: '123456',
            city: 'Test City',
            state: 'maharashtra'
          }
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateFormData(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedData).toBeDefined();
    });

    test('should reject invalid step 2 data', () => {
      const req = {
        body: {
          step: 2,
          data: {
            pan_number: 'ABCD1234F', // Invalid
            business_name: 'Test Business',
            business_type: 'proprietorship',
            pincode: '123456',
            city: 'Test City',
            state: 'maharashtra'
          }
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateFormData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'pan_number',
            message: expect.stringContaining('PAN number must be in format ABCDE1234F')
          })
        ])
      });
    });

    test('should reject invalid step number', () => {
      const req = {
        body: {
          step: 3,
          data: {}
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateFormData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid step number. Must be 1 or 2.'
      });
    });

    test('should reject missing step or data', () => {
      const req = {
        body: {
          step: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateFormData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Step and data are required'
      });
    });
  });
});