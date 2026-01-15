# Medical Offices Page - Documentation

## 📋 Overview

The Medical Offices page is a comprehensive management interface for tracking and managing medical offices and specialists. It features a data table with filters, toggles, and action buttons.

## 📁 File Structure

```
FR EXCALIBUR/
├── app/
│   └── medical-offices/
│       └── page.tsx                    # Main page component
├── lib/
│   ├── types/
│   │   └── medical-office.ts           # TypeScript interfaces
│   ├── constants/
│   │   └── medical-office.ts           # Constants (months, boroughs, columns)
│   └── data/
│       └── medical-offices-mock.ts     # Mock data for development
```

## 🎨 Features

### Header
- **Logo**: EXCALIBUR PERSONAL INJURY branding
- **Search Bar**: Global search functionality
- **Notification Icons**: Calendar, Email, Notifications (with badge indicators)
- **User Profile**: Display current user name

### Navigation Tabs
1. Medical Offices/Specialist (active)
2. Intakes PIMM list medical
3. Reminders/calendar
4. Handling lawyers management

### Filters
- **Tipo de ingreso**: Radio buttons (Medical offices / Specialist)
- **Borough**: Dropdown with NYC boroughs
- **Month**: Dropdown with months in Spanish
- **Year**: Number input
- **Create Button**: Yellow button to add new medical offices

### Data Table

#### Columns:
1. **Total quota** - Number
2. **Medical office name** - Text with subtitle
3. **Monthly quota** - Number
4. **Used quota** - Number
5. **Available quota** - Number
6. **Active** - Toggle switch (yellow when active)
7. **Priority** - Toggle switch
8. **Transportation** - Toggle switch (yellow when active)
9. **Tipo de horario** - Checkboxes (Neck/Back)
10. **Address** - Text
11. **Phone** - Text
12. **Actions** - Copy, Edit, Delete icons

#### Table Features:
- Alternating row colors (white/light yellow #FEF9E8)
- Hover effects
- Interactive toggles and checkboxes
- Action buttons for each row

## 🔧 TypeScript Interfaces

### MedicalOffice
```typescript
interface MedicalOffice {
    id: string;
    totalQuota: number;
    name: string;
    monthlyQuota: number;
    usedQuota: number;
    availableQuota: number;
    active: boolean;
    priority: boolean;
    transportation: boolean;
    scheduleTypes: {
        neck: boolean;
        back: boolean;
    };
    address: string;
    phone: string;
}
```

### MedicalOfficeFilters
```typescript
interface MedicalOfficeFilters {
    type: 'medical' | 'specialist';
    borough: string;
    month: string;
    year: string;
}
```

## 🎨 Color Scheme

- **Primary Yellow**: `#EAB308` - Used for active toggles, checkboxes, and buttons
- **Hover Yellow**: `#D97706` - Button hover state
- **Light Yellow**: `#FEF9E8` - Alternate table row background
- **White**: `#FFFFFF` - Primary table row background
- **Gray**: Various shades for borders and text

## 🚀 Usage

Navigate to `/medical-offices` to access the page.

### Toggle Actions
```typescript
const handleToggle = (id: string, field: 'active' | 'priority' | 'transportation') => {
    // Updates the specific field for the medical office
};
```

### Schedule Type Toggle
```typescript
const handleScheduleTypeToggle = (id: string, type: 'neck' | 'back') => {
    // Updates neck or back schedule type
};
```

## 📊 Mock Data

The page currently uses mock data from `lib/data/medical-offices-mock.ts`. Replace this with actual API calls when backend is ready.

## 🔄 Future Enhancements

1. **API Integration**: Connect to real backend
2. **Pagination**: Add pagination for large datasets
3. **Sorting**: Column sorting functionality
4. **Advanced Filters**: More filter options
5. **Export**: Export table data to CSV/Excel
6. **Create Modal**: Modal form for creating new medical offices
7. **Edit Modal**: Modal form for editing existing offices
8. **Delete Confirmation**: Confirmation dialog before deletion
9. **Search**: Implement search functionality
10. **Permissions**: Role-based access control

## 📱 Responsive Design

The page is designed for desktop use. Mobile responsiveness can be added by:
- Making table horizontally scrollable
- Stacking filters vertically
- Collapsing header elements

## 🎯 Key Components

- **Material-UI Table**: For data display
- **Material-UI Switches**: For toggle functionality
- **Material-UI Checkboxes**: For schedule types
- **Material-UI Tabs**: For navigation
- **Material-UI TextField**: For filters

## 🔐 Access

This page should be protected and only accessible to authenticated users with appropriate permissions.
