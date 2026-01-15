# Accident Form - Code Organization

This document describes the organized structure of the Accident Form feature.

## 📁 Project Structure

```
FR EXCALIBUR/
├── app/
│   └── accident-form/
│       └── page.tsx              # Main page component
├── components/
│   └── forms/
│       ├── CustomInput.tsx       # Reusable form input component
│       └── DateInputStyles.tsx   # Calendar icon styling component
├── lib/
│   ├── constants/
│   │   └── accident-form.ts      # Form constants (API keys, options)
│   ├── types/
│   │   └── accident-form.ts      # TypeScript type definitions
│   └── utils/
│       └── form-validation.ts    # Validation utilities
```

## 🧩 Components

### CustomInput (`components/forms/CustomInput.tsx`)
Reusable input component that supports:
- Text inputs
- Date inputs with custom calendar styling
- Select dropdowns
- Textareas
- Error states and validation
- Custom placeholders

**Props:**
- `label`: string
- `value`: string | number
- `onChange`: function
- `required`: boolean (optional)
- `error`: boolean (optional)
- `helperText`: string (optional)
- `type`: string (optional, default: 'text')
- `placeholder`: string (optional)
- `multiline`: boolean (optional)
- `rows`: number (optional)
- `select`: boolean (optional)
- `children`: React.ReactNode (optional, for select options)
- `disabled`: boolean (optional)

### DateInputStyles (`components/forms/DateInputStyles.tsx`)
Provides custom styling for date input calendar icons:
- Yellow/gold color (#EAB308)
- 1.5x larger size
- Hover effects

## 📊 Types

### AccidentFormData (`lib/types/accident-form.ts`)
```typescript
interface AccidentFormData {
    firstName: string;
    lastName: string;
    accidentType: string;
    dateOfBirth: string;
    hasEmergencyContact: string;
    numberOfPersons: string[];
    address: string;
    description: string;
    borough: string;
    year: string;
}
```

### ValidationErrors (`lib/types/accident-form.ts`)
```typescript
interface ValidationErrors {
    [key: string]: boolean;
}
```

## 🔧 Constants

### Form Constants (`lib/constants/accident-form.ts`)
- `GOOGLE_MAPS_API_KEY`: Google Maps API key
- `GOOGLE_MAPS_LIBRARIES`: Required Google Maps libraries
- `ACCIDENT_TYPES`: Array of accident type options
- `BOROUGHS`: Array of NYC borough options

## 🛠️ Utilities

### Form Validation (`lib/utils/form-validation.ts`)

#### `validateAccidentForm(formData: AccidentFormData): ValidationErrors`
Validates all required fields in the accident form.

**Returns:** Object with field names as keys and boolean values indicating errors

#### `getInitialFormData(): AccidentFormData`
Returns initial/empty state for the form.

**Returns:** AccidentFormData object with empty values

## 🎨 Styling

The form uses:
- **Tailwind CSS** for utility classes
- **Material-UI** for complex components (Radio, Checkbox, etc.)
- **Custom CSS** for date picker calendar icon (via DateInputStyles component)

### Color Scheme
- Primary: `#EAB308` (Yellow/Gold)
- Error: `#EF4444` (Red)
- Success: `#059669` (Green)
- Gray: `#6D6D6D`

## 🚀 Usage Example

```typescript
import { CustomInput } from '@/components/forms/CustomInput';
import { ACCIDENT_TYPES } from '@/lib/constants/accident-form';
import { AccidentFormData } from '@/lib/types/accident-form';
import { validateAccidentForm } from '@/lib/utils/form-validation';

// In your component
const [formData, setFormData] = useState<AccidentFormData>(getInitialFormData());

// Validate
const errors = validateAccidentForm(formData);

// Use CustomInput
<CustomInput
    label="First Name"
    value={formData.firstName}
    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
    required
    error={errors.firstName}
    helperText={errors.firstName ? 'This field is required' : ''}
/>
```

## 📝 Benefits of This Structure

1. **Reusability**: Components can be used across different forms
2. **Type Safety**: TypeScript interfaces ensure data consistency
3. **Maintainability**: Separated concerns make code easier to update
4. **Testability**: Isolated utilities and components are easier to test
5. **Scalability**: Easy to add new form fields or validation rules
6. **Organization**: Clear separation between UI, logic, and data

## 🔄 Future Improvements

- Add unit tests for validation utilities
- Create more reusable form components (RadioGroup, CheckboxGroup)
- Add form state management (React Hook Form, Formik)
- Implement server-side validation
- Add internationalization (i18n) support
