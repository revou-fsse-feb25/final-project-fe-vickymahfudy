import { useState, ChangeEvent, FormEvent } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K], formData: T) => string | null;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormProps<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({ 
  initialValues, 
  validationRules = {}, 
  onSubmit 
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  // Mark field as touched on blur and validate
  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, value);
  };

  // Validate a single field
  const validateField = (name: string, value: any) => {
    const fieldKey = name as keyof T;
    const validateRule = validationRules[fieldKey];
    
    if (validateRule) {
      const error = validateRule(value, values);
      
      setErrors(prev => ({
        ...prev,
        [fieldKey]: error
      }));
      
      return !error;
    }
    
    return true;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors<T> = {};
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    Object.keys(values).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Validate each field
    Object.keys(values).forEach(key => {
      const fieldKey = key as keyof T;
      const validateRule = validationRules[fieldKey];
      
      if (validateRule) {
        const error = validateRule(values[fieldKey], values);
        if (error) {
          newErrors[fieldKey] = error;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set a specific field value programmatically
  const setFieldValue = (name: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set multiple field values at once
  const setMultipleFields = (newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setMultipleFields,
    validateForm,
    validateField
  };
}