import React, { useState } from 'react';
import './UdyamRegistrationForm.css';

const UdyamRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="udyam-form-container">
      <div className="form-header">
        <h1>Udyam Registration</h1>
        <p>Complete your MSME registration in two simple steps</p>
      </div>

      <div className="progress-tracker">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 2) * 100}%` }}
          ></div>
        </div>
        <div className="steps-container">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Step 1: Aadhaar + OTP</h4>
              <p>Identity Verification</p>
            </div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Step 2: PAN + Business</h4>
              <p>Business Details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-content">
        {currentStep === 1 ? (
          <div className="step-form">
            <h2>Step 1: Aadhaar + OTP Validation</h2>
            <div className="form-fields">
              <div className="form-field">
                <label>Aadhaar Number *</label>
                <input type="text" placeholder="Enter 12-digit Aadhaar number" maxLength={12} />
              </div>
              <div className="form-field">
                <label>Mobile Number *</label>
                <input type="tel" placeholder="Enter 10-digit mobile number" maxLength={10} />
              </div>
              <div className="form-field">
                <label>OTP *</label>
                <input type="text" placeholder="Enter 6-digit OTP" maxLength={6} />
              </div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentStep(2)}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="step-form">
            <h2>Step 2: PAN + Business Details</h2>
            <div className="form-fields">
              <div className="form-field">
                <label>PAN Number *</label>
                <input type="text" placeholder="Enter PAN number (e.g., ABCDE1234F)" maxLength={10} />
              </div>
              <div className="form-field">
                <label>Business Name *</label>
                <input type="text" placeholder="Enter business name" />
              </div>
              <div className="form-field">
                <label>Business Type *</label>
                <select>
                  <option value="">Select business type</option>
                  <option value="proprietorship">Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="private_limited">Private Limited Company</option>
                  <option value="llp">Limited Liability Partnership</option>
                </select>
              </div>
              <div className="form-field">
                <label>Pincode *</label>
                <input type="text" placeholder="Enter 6-digit pincode" maxLength={6} />
              </div>
              <div className="form-field">
                <label>City *</label>
                <input type="text" placeholder="Enter city name" />
              </div>
              <div className="form-field">
                <label>State *</label>
                <select>
                  <option value="">Select state</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="delhi">Delhi</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="tamil_nadu">Tamil Nadu</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                Previous
              </button>
              <button className="btn btn-success">
                Complete Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UdyamRegistrationForm; 