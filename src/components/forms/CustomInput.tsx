import React, { forwardRef } from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label: string;
    helperText?: string;
    error?: boolean;
    multiline?: boolean;
    rows?: number;
    select?: boolean;
    children?: React.ReactNode;
}

export const CustomInput = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, CustomInputProps>(({
    label,
    value,
    onChange,
    required = false,
    error = false,
    helperText = '',
    type = 'text',
    placeholder = '',
    multiline = false,
    rows = 1,
    select = false,
    children = null,
    disabled = false,
    className = '',
    ...props
}, ref) => {
    const generatedId = React.useId();
    const inputId = props.id || generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
        <div className={`w-full ${className}`}>
            <label
                htmlFor={inputId}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
                {label}
                {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
            </label>
            {select ? (
                <select
                    id={inputId}
                    ref={ref as React.Ref<HTMLSelectElement>}
                    value={value}
                    onChange={onChange as any} // Simplify typing for now
                    disabled={disabled}
                    aria-invalid={error}
                    aria-describedby={helperId}
                    aria-required={required}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 !bg-white !text-gray-900
                        ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-200 dark:border-gray-700 focus:border-primary-main'}
                        focus:outline-none focus:ring-2 focus:ring-primary-main/20
                        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-black disabled:opacity-100
                        appearance-none cursor-pointer`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23EAB308' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem',
                        color: '#111827',
                    }}
                    {...props as any}
                >
                    <option value="" disabled style={{ color: '#9CA3AF' }}>Select an option</option>
                    {children}
                </select>
            ) : multiline ? (
                <textarea
                    id={inputId}
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                    value={value}
                    onChange={onChange as any}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    aria-invalid={error}
                    aria-describedby={helperId}
                    aria-required={required}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 overflow-hidden resize-none !text-gray-900 !bg-white
                        ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-200 dark:border-gray-700 focus:border-primary-main'}
                        focus:outline-none focus:ring-2 focus:ring-primary-main/20
                        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-black disabled:opacity-100
                        placeholder:text-gray-400`}
                    {...props as any}
                />
            ) : (
                <input
                    id={inputId}
                    ref={ref as React.Ref<HTMLInputElement>}
                    type={type}
                    value={value}
                    onChange={onChange as any}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-invalid={error}
                    aria-describedby={helperId}
                    aria-required={required}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-base !text-gray-900 !bg-white
                        ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-200 dark:border-gray-700 focus:border-primary-main'}
                        focus:outline-none focus:ring-2 focus:ring-primary-main/20
                        disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-black disabled:opacity-100
                        placeholder:text-gray-400
                        ${type === 'date' ? 'date-input-custom' : ''}`}
                    style={{
                        ...(type === 'date' ? { colorScheme: 'light' } : {}),
                        WebkitTextFillColor: disabled ? '#000000' : undefined,
                        color: disabled ? '#000000' : undefined,
                        opacity: 1
                    }}
                    {...props as any}
                />
            )}
            {helperText && (
                <p id={helperId} className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                    {helperText}
                </p>
            )}
            {props.maxLength && (
                <div className="text-right mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        {String(value || '').length} / {props.maxLength}
                    </span>
                </div>
            )}
        </div>
    );
});

CustomInput.displayName = 'CustomInput';
