import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormData, Field } from '../types/form';
import './FormField.css';

interface FormFieldProps {
  field: Field;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  pincodeData?: any;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  register,
  errors,
  setValue,
  watch,
  pincodeData
}) => {
  const fieldError = errors[field.name as keyof FormData];
  const fieldValue = watch(field.name as keyof FormData);

  const renderField = () => {
    switch (field.type) {
      case 'select':
        return (
          <select
            {...register(field.name as keyof FormData, {
              required: field.required,
              validate: (value) => {
                if (field.required && !value) {
                  return field.validation?.message || 'This field is required';
                }
                return true;
              }
            })}
            className={`form-select ${fieldError ? 'error' : ''}`}
            aria-describedby={`${field.name}-error`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        );

      case 'text':
      default:
        // Special handling for pincode field
        if (field.name === 'pincode') {
          return (
            <div className="pincode-field">
              <input
                {...register(field.name as keyof FormData, {
                  required: field.required,
                  pattern: {
                    value: new RegExp(field.pattern || ''),
                    message: field.validation?.message || 'Invalid format'
                  },
                  maxLength: {
                    value: field.maxLength || 100,
                    message: `Maximum ${field.maxLength} characters allowed`
                  }
                })}
                type="text"
                id={field.id}
                className={`form-input ${fieldError ? 'error' : ''}`}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                aria-describedby={`${field.name}-error`}
              />
              {pincodeData && (
                <div className="pincode-suggestion">
                  <small>
                    📍 {pincodeData.city}, {pincodeData.state}
                  </small>
                </div>
              )}
            </div>
          );
        }

        // Special handling for PAN field
        if (field.name === 'pan_number') {
          return (
            <input
              {...register(field.name as keyof FormData, {
                required: field.required,
                pattern: {
                  value: new RegExp(field.pattern || ''),
                  message: field.validation?.message || 'Invalid PAN format'
                },
                maxLength: {
                  value: field.maxLength || 10,
                  message: `Maximum ${field.maxLength} characters allowed`
                },
                transform: (value) => value.toUpperCase()
              })}
              type="text"
              id={field.id}
              className={`form-input ${fieldError ? 'error' : ''}`}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              style={{ textTransform: 'uppercase' }}
              aria-describedby={`${field.name}-error`}
            />
          );
        }

        // Special handling for Aadhaar field
        if (field.name === 'aadhaar_number') {
          return (
            <input
              {...register(field.name as keyof FormData, {
                required: field.required,
                pattern: {
                  value: new RegExp(field.pattern || ''),
                  message: field.validation?.message || 'Invalid Aadhaar format'
                },
                maxLength: {
                  value: field.maxLength || 12,
                  message: `Maximum ${field.maxLength} characters allowed`
                }
              })}
              type="text"
              id={field.id}
              className={`form-input ${fieldError ? 'error' : ''}`}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              aria-describedby={`${field.name}-error`}
            />
          );
        }

        // Special handling for mobile number field
        if (field.name === 'mobile_number') {
          return (
            <input
              {...register(field.name as keyof FormData, {
                required: field.required,
                pattern: {
                  value: new RegExp(field.pattern || ''),
                  message: field.validation?.message || 'Invalid mobile number format'
                },
                maxLength: {
                  value: field.maxLength || 10,
                  message: `Maximum ${field.maxLength} characters allowed`
                }
              })}
              type="tel"
              id={field.id}
              className={`form-input ${fieldError ? 'error' : ''}`}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              aria-describedby={`${field.name}-error`}
            />
          );
        }

        // Special handling for OTP field
        if (field.name === 'otp') {
          return (
            <input
              {...register(field.name as keyof FormData, {
                required: field.required,
                pattern: {
                  value: new RegExp(field.pattern || ''),
                  message: field.validation?.message || 'Invalid OTP format'
                },
                maxLength: {
                  value: field.maxLength || 6,
                  message: `Maximum ${field.maxLength} characters allowed`
                }
              })}
              type="text"
              id={field.id}
              className={`form-input ${fieldError ? 'error' : ''}`}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              aria-describedby={`${field.name}-error`}
            />
          );
        }

        // Default text input
        return (
          <input
            {...register(field.name as keyof FormData, {
              required: field.required,
              minLength: {
                value: 2,
                message: 'Minimum 2 characters required'
              },
              maxLength: {
                value: field.maxLength || 100,
                message: `Maximum ${field.maxLength} characters allowed`
              }
            })}
            type="text"
            id={field.id}
            className={`form-input ${fieldError ? 'error' : ''}`}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            aria-describedby={`${field.name}-error`}
          />
        );
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
      
      {renderField()}
      
      {fieldError && (
        <div id={`${field.name}-error`} className="field-error" role="alert">
          {fieldError.message}
        </div>
      )}
      
      {field.placeholder && (
        <small className="field-help">
          {field.placeholder}
        </small>
      )}
    </div>
  );
};

export default FormField; 