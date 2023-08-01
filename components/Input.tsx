import React, {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

type LabelProps = {} & LabelHTMLAttributes<HTMLLabelElement>;

export const Label = (props: LabelProps) => {
  const {className, children, ...rest} = props;

  return (
    <label
      className={`${className} block text-xs font-semibold uppercase tracking-widest text-gray-300`}
      {...rest}
    >
      {children}
    </label>
  );
};

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'lg' | 'xl';

type InputProps = {
  variant?: Variant;
  size?: Size;
  error?: any;
  icon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {className, error, ...rest} = props;

    // TODO: modify className based on variant, size, etc
    return (
      <input
        ref={ref}
        className={`${className} ${
          error
            ? 'border-red-500 focus:border-red-400'
            : 'border-gray-700 focus:border-gray-600'
        } w-full rounded border bg-gray-700 bg-opacity-60 px-3 py-2 font-medium text-gray-300 outline-none placeholder:text-gray-500`}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';

type TextAreaProps = {
  variant?: Variant;
  size?: Size;
  error?: any;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const {className, variant, size, error, ...rest} = props;

    // TODO: modify className based on variant, size, etc
    return (
      <textarea
        ref={ref}
        className={`${className} ${
          error
            ? 'border-red-500 focus:border-red-400'
            : 'border-gray-700 focus:border-gray-600'
        } w-full resize-none rounded border bg-gray-700 bg-opacity-60 px-3 py-2 font-medium text-gray-300 outline-none placeholder:text-gray-500`}
        {...rest}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

type CheckboxProps = {} & InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const {className, ...rest} = props;

    return (
      <input
        ref={ref}
        className={`${className} form-checkbox mr-3 h-4 w-4 cursor-pointer appearance-none rounded-sm border bg-transparent bg-contain bg-center bg-no-repeat align-top text-indigo-500 transition duration-200 checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 checked:focus:border-indigo-500 checked:focus:bg-indigo-500`}
        type="checkbox"
        {...rest}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

type SelectProps = {
  variant?: Variant;
  size?: Size;
  error?: any;
  icon?: React.ReactNode;
} & InputHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {className, error, ...rest} = props;

    // TODO: modify className based on variant, size, etc
    return (
      <div className={`relative ${className}`}>
        <select
          ref={ref}
          className={`${className} ${
            error
              ? 'border-red-500 focus:border-red-400'
              : 'border-gray-700 focus:border-gray-600'
          } w-full appearance-none rounded border bg-gray-700 bg-opacity-60 py-2 pl-3 pr-8 font-medium text-gray-300 outline-none`}
          {...rest}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
