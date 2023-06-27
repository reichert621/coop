import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';

type AlertType = 'success' | 'info' | 'warning' | 'danger';

const getClassNamesByAlertType = (type: AlertType) => {
  switch (type) {
    case 'success':
      return 'border-green-700 bg-green-500 bg-opacity-60';
    case 'info':
      return 'border-blue-700 bg-blue-500 bg-opacity-60';
    case 'warning':
      return 'border-yellow-700 bg-yellow-500 bg-opacity-60';
    case 'danger':
      return 'border-red-700 bg-red-500 bg-opacity-60';
  }
};

const AlertIcon = ({
  className,
  type,
}: {
  className?: string;
  type: AlertType;
}) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={`${className} text-green-200`} />;
    case 'info':
      return <InformationCircleIcon className={`${className} text-blue-200`} />;
    case 'warning':
      return (
        <InformationCircleIcon className={`${className} text-yellow-200`} />
      );
    case 'danger':
      return (
        <ExclamationTriangleIcon className={`${className} text-red-200`} />
      );
  }
};

export const Alert = ({
  className = '',
  icon,
  type,
  title,
  description,
  cta,
}: {
  className?: string;
  icon?: React.ReactNode;
  type: AlertType;
  title: string;
  description?: string;
  cta?: React.ReactNode;
}) => {
  return (
    <div
      className={`${className} ${getClassNamesByAlertType(
        type
      )} rounded-r border-l-2 px-3 py-2 shadow`}
      role="alert"
    >
      <div className="flex">
        <div className={description ? 'py-1' : 'py-0'}>
          {icon || <AlertIcon className="mr-3 h-6 w-6" type={type} />}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">{title}</p>
          {!!description && (
            <p className="text-sm text-gray-100">{description}</p>
          )}
        </div>
        {cta && <div className="self-center">{cta}</div>}
      </div>
    </div>
  );
};

export default Alert;
