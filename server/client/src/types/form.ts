export interface Field {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'select' | 'email' | 'tel' | 'number';
  required: boolean;
  pattern?: string;
  maxLength?: number;
  placeholder?: string;
  options?: Array<{
    value: string;
    text: string;
  }>;
  validation?: {
    type: string;
    message: string;
  };
}

export interface Step {
  id: number;
  title: string;
  description: string;
  fields: Field[];
}

export interface FormSchema {
  steps: Step[];
}

export interface FormData {
  aadhaar_number?: string;
  mobile_number?: string;
  otp?: string;
  pan_number?: string;
  business_name?: string;
  business_type?: string;
  pincode?: string;
  city?: string;
  state?: string;
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  district?: string;
  area?: string;
} 