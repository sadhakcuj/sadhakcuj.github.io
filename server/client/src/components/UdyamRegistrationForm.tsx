import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import './UdyamRegistrationForm.css';
import ProgressTracker from './ProgressTracker';
import FormField from './FormField';
import { FormData, FormSchema, Step } from '../types/form';

const UdyamRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [pincodeData, setPincodeData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
    reset
  } = useForm<FormData>({
    mode: 'onChange'
  });

  // Watch pincode for auto-fill suggestions
  const watchedPincode = watch('pincode');

  // Fetch form schema on component mount
  useEffect(() => {
    fetchFormSchema();
  }, []);

  // Auto-fill city and state based on pincode
  useEffect(() => {
    if (watchedPincode && watchedPincode.length === 6) {
      fetchPincodeData(watchedPincode);
    }
  }, [watchedPincode]);

  const fetchFormSchema = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/form/schema');
      setFormSchema(response.data.data);
    } catch (error) {
      console.error('Error fetching form schema:', error);
      toast.error('Failed to load form. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPincodeData = async (pincode: string) => {
    try {
      const response = await axios.get(`/api/validation/pincode/${pincode}`);
      const data = response.data.data;
      setPincodeData(data);
      
      // Auto-fill city and state
      if (data.city) setValue('city', data.city);
      if (data.state) setValue('state', data.state);
      
      toast.success('City and state auto-filled based on pincode!');
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      setPincodeData(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      // Submit form data to backend
      const response = await axios.post('/api/form/submit', {
        step: currentStep,
        data: data
      });

      if (response.data.success) {
        toast.success(`Step ${currentStep} completed successfully!`);
        
        if (currentStep < 2) {
          // Move to next step
          setCurrentStep(currentStep + 1);
          setFormData({ ...formData, ...data });
          reset();
        } else {
          // Form completed
          toast.success('Udyam registration completed successfully!');
          // Reset form and go back to step 1
          setCurrentStep(1);
          setFormData({});
          reset();
        }
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit form';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const isValidStep = await trigger();
    if (isValidStep) {
      const currentFormData = watch();
      setFormData({ ...formData, ...currentFormData });
      setCurrentStep(currentStep + 1);
      reset();
    } else {
      toast.error('Please fill all required fields correctly before proceeding.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Restore previous step data
      const previousData = Object.keys(formData).reduce((acc, key) => {
        if (key !== 'otp') { // Don't restore OTP
          acc[key] = formData[key];
        }
        return acc;
      }, {} as FormData);
      reset(previousData);
    }
  };

  const getCurrentStepData = (): Step | null => {
    if (!formSchema) return null;
    return formSchema.steps.find(step => step.id === currentStep) || null;
  };

  if (isLoading && !formSchema) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading form...</p>
      </div>
    );
  }

  if (!formSchema) {
    return (
      <div className="error-container">
        <h2>Error Loading Form</h2>
        <p>Failed to load the registration form. Please refresh the page.</p>
      </div>
    );
  }

  const currentStepData = getCurrentStepData();

  return (
    <div className="udyam-form-container">
      <div className="form-header">
        <h1>Udyam Registration</h1>
        <p>Complete your MSME registration in two simple steps</p>
      </div>

      <ProgressTracker currentStep={currentStep} totalSteps={2} />

      <div className="form-content">
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          <div className="step-header">
            <h2>Step {currentStep}: {currentStepData?.title}</h2>
            <p>{currentStepData?.description}</p>
          </div>

          <div className="form-fields">
            {currentStepData?.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                pincodeData={pincodeData}
              />
            ))}
          </div>

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Previous
              </button>
            )}
            
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
                disabled={isLoading || !isValid}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
                disabled={isLoading || !isValid}
              >
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>
      </div>

      {currentStep === 1 && (
        <div className="form-info">
          <h3>What you'll need for Step 1:</h3>
          <ul>
            <li>Valid Aadhaar number (12 digits)</li>
            <li>Mobile number linked with Aadhaar</li>
            <li>OTP sent to your mobile number</li>
          </ul>
        </div>
      )}

      {currentStep === 2 && (
        <div className="form-info">
          <h3>What you'll need for Step 2:</h3>
          <ul>
            <li>PAN number of the business/enterprise</li>
            <li>Business name and type</li>
            <li>Business address details</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UdyamRegistrationForm; 