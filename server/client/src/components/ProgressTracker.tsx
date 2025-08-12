import React from 'react';
import './ProgressTracker.css';

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, title: 'Aadhaar + OTP', description: 'Identity Verification' },
    { id: 2, title: 'PAN + Business', description: 'Business Details' }
  ];

  return (
    <div className="progress-tracker">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="steps-container">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`step ${step.id <= currentStep ? 'active' : ''} ${step.id === currentStep ? 'current' : ''}`}
          >
            <div className="step-number">
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <div className="step-content">
              <h4 className="step-title">{step.title}</h4>
              <p className="step-description">{step.description}</p>
            </div>
            {step.id < totalSteps && (
              <div className="step-connector"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="progress-text">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default ProgressTracker; 