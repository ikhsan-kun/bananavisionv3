import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'green', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4',
    };

    const colorClasses = {
        green: 'border-gray-200 border-t-green-500',
        blue: 'border-gray-200 border-t-blue-500',
        white: 'border-white/30 border-t-white',
        gray: 'border-gray-300 border-t-gray-600',
        dark: 'border-gray-900/20 border-t-gray-900',
    };

    return (
        <div
            className={`spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
