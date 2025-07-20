
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="px-8 py-3 bg-brand-accent text-white font-semibold rounded-lg shadow-lg hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-brand-accent-hover focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
      {...props}
    >
      {children}
    </button>
  );
};
