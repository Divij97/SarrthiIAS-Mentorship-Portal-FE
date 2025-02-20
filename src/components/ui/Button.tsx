import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded transition-colors duration-200',
        {
          'bg-orange-500 text-white hover:bg-orange-600': variant === 'primary',
          'bg-gray-200 text-gray-700 hover:bg-gray-300': variant === 'secondary',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}; 