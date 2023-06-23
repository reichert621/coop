import React, {AnchorHTMLAttributes, ButtonHTMLAttributes} from 'react';

import Spinner from '@/components/Spinner';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'xs' | 'sm' | 'lg' | 'xl';

const getColorClassNames = (variant?: Variant) => {
  switch (variant) {
    case 'primary':
      return 'Button--primary';
    case 'secondary':
      return 'Button--secondary';
    case 'danger':
      return 'Button--danger';
    default:
      return '';
  }
};

const getSizeClassNames = (size?: Size) => {
  switch (size) {
    case 'xl':
      return 'py-4 px-8 text-lg';
    case 'lg':
      return 'py-3 px-6 text-base';
    case 'sm':
      return 'py-1 px-3 text-sm';
    case 'xs':
      return 'py-0.5 px-1 text-sm leading-tight';
    default:
      return 'py-2 px-4 text-sm';
  }
};

const getIconClassNames = (size?: Size) => {
  switch (size) {
    case 'xl':
      return 'mr-4 -ml-1 h-6 w-6';
    case 'lg':
      return 'mr-4 -ml-1 h-5 w-5';
    case 'sm':
    default:
      return 'mr-2 -ml-1 h-4 w-4';
  }
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  pending?: boolean;
  inline?: boolean;
  icon?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      className,
      disabled,
      pending,
      variant,
      size,
      inline,
      icon,
      children,
      ...rest
    } = props;
    const variantClassName = getColorClassNames(variant);
    const sizeClassName = getSizeClassNames(size);
    const iconClassName = pending ? getIconClassNames(size) : '';

    return (
      <button
        ref={ref}
        className={`${
          inline ? 'inline-flex' : 'flex'
        } items-center justify-center font-medium transition-all ${variantClassName} ${sizeClassName} ${className}`}
        disabled={disabled || pending}
        {...rest}
      >
        {pending ? <Spinner className={iconClassName} /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

type AnchorProps = {
  variant?: Variant;
  size?: Size;
  inline?: boolean;
  icon?: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const A = (props: AnchorProps) => {
  const {className, variant, size, inline, icon, children, ...rest} = props;
  const variantClassName = getColorClassNames(variant);
  const sizeClassName = getSizeClassNames(size);

  return (
    <a
      className={`${
        inline ? 'inline-flex' : 'flex'
      } items-center justify-center font-medium transition-all ${variantClassName} ${sizeClassName} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </a>
  );
};
