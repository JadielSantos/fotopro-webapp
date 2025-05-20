import React from 'react';
import { Input } from './Input';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

interface FormTextProps {
  children: React.ReactNode;
  className?: string;
}

const FormComponent: React.FC<FormProps> & {
  Group: React.FC<FormGroupProps>;
  Label: React.FC<FormLabelProps>;
  Input: typeof Input;
  Text: React.FC<FormTextProps>;
} = ({ children, className = '', ...props }) => {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
};

const Group: React.FC<FormGroupProps> = ({ children, className = '' }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

const Label: React.FC<FormLabelProps> = ({ children, required = false, className = '', ...props }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

const Text: React.FC<FormTextProps> = ({ children, className = '' }) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};

FormComponent.Group = Group;
FormComponent.Label = Label;
FormComponent.Input = Input;
FormComponent.Text = Text;

export const Form = FormComponent;
export default Form;
