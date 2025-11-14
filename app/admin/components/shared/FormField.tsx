interface FormFieldProps {
    label?: string
    type?: 'text' | 'email' | 'date' | 'number' | 'url' | 'textarea' | 'select' | 'checkbox' | 'range'
    value: any
    onChange: (value: any) => void
    placeholder?: string
    required?: boolean
    disabled?: boolean
    className?: string
    rows?: number
    min?: number
    max?: number
    options?: { value: string; label: string }[]
  }
  
  export function FormField({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required,
    disabled,
    className = '',
    rows = 3,
    min,
    max,
    options,
  }: FormFieldProps) {
    const baseInputClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 disabled:opacity-50"
    
    const renderInput = () => {
      switch (type) {
        case 'textarea':
          return (
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              rows={rows}
              className={`${baseInputClass} ${className}`}
            />
          )
        
        case 'select':
          return (
            <select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              disabled={disabled}
              className={`${baseInputClass} ${className}`}
            >
              <option value="">{placeholder || 'Select...'}</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )
        
        case 'checkbox':
          return (
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
          )
        
        case 'range':
          return (
            <div>
              <input
                type="range"
                min={min || 0}
                max={max || 100}
                value={value || 0}
                onChange={(e) => onChange(parseInt(e.target.value))}
                disabled={disabled}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                Value: {value || 0}{max ? ` / ${max}` : ''}
              </div>
            </div>
          )
        
        default:
          return (
            <input
              type={type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              min={min}
              max={max}
              className={`${baseInputClass} ${className}`}
            />
          )
      }
    }
  
    return (
      <div className={type === 'checkbox' ? 'flex items-center gap-2' : ''}>
        {label && (
          <label className={`block text-sm font-medium ${type === 'checkbox' ? '' : 'mb-1'}`}>
            {label}
          </label>
        )}
        {renderInput()}
      </div>
    )
  }