
import { Box, Button } from '@mui/material';
import { PIIntakeFormData } from '@/lib/types/pi-intake';

interface PersonNavigationProps {
    formData: PIIntakeFormData;
    activePerson: number;
    setActivePerson: (person: number) => void;
}

export const PersonNavigation = ({ formData, activePerson, setActivePerson }: PersonNavigationProps) => {
    // Only show if we have 2 or more people
    const personCount = parseInt(formData.numberOfPersonsInAccident || '1', 10);
    if (personCount < 2) return null;

    const people = [
        {
            id: 1,
            label: formData.persons?.[1]?.firstName && formData.persons?.[1]?.lastName
                ? `${formData.persons[1].firstName} ${formData.persons[1].lastName}`
                : (formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : 'Person 1')
        },
        {
            id: 2,
            label: formData.persons?.[2]?.firstName && formData.persons?.[2]?.lastName
                ? `${formData.persons[2].firstName} ${formData.persons[2].lastName}`
                : 'Person 2'
        },
        {
            id: 3,
            label: formData.persons?.[3]?.firstName && formData.persons?.[3]?.lastName
                ? `${formData.persons[3].firstName} ${formData.persons[3].lastName}`
                : 'Person 3'
        },
        {
            id: 4,
            label: formData.persons?.[4]?.firstName && formData.persons?.[4]?.lastName
                ? `${formData.persons[4].firstName} ${formData.persons[4].lastName}`
                : 'Person 4'
        },
        {
            id: 5,
            label: formData.persons?.[5]?.firstName && formData.persons?.[5]?.lastName
                ? `${formData.persons[5].firstName} ${formData.persons[5].lastName}`
                : 'Person 5'
        },
        {
            id: 6,
            label: formData.persons?.[6]?.firstName && formData.persons?.[6]?.lastName
                ? `${formData.persons[6].firstName} ${formData.persons[6].lastName}`
                : 'Person 6'
        },
    ];

    // Filter to only show the number of people selected
    const visiblePeople = people.slice(0, personCount);

    return (
        <Box
            className="flex gap-3 mb-8 overflow-x-auto py-3 px-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 mx-auto max-w-fit"
            sx={{
                position: 'sticky',
                top: '120px',
                zIndex: 30,
                alignSelf: 'center', // Changed from flex-start to center for better visual in parent column
            }}
        >
            {visiblePeople.map((person) => (
                <Button
                    key={person.id}
                    variant={activePerson === person.id ? 'contained' : 'outlined'}
                    onClick={() => setActivePerson(person.id)}
                    sx={{
                        backgroundColor: activePerson === person.id ? '#4b6bd6 !important' : 'white !important',
                        color: activePerson === person.id ? 'white !important' : '#6B7280 !important',
                        borderRadius: '50px',
                        minWidth: '150px',
                        height: '40px',
                        px: 2,
                        py: 1.25,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap',
                        boxShadow: activePerson === person.id ? '0 2px 4px rgba(75, 107, 214, 0.3)' : 'none',
                        border: activePerson === person.id ? 'none' : '2px solid #E5E7EB',
                        fontFamily: 'inherit',
                        flexShrink: 0,
                        '&:hover': {
                            backgroundColor: activePerson === person.id ? '#3a54a8 !important' : '#F3F4F6 !important',
                            borderColor: activePerson === person.id ? 'transparent' : '#4b6bd6 !important',
                            color: activePerson === person.id ? 'white !important' : '#4b6bd6 !important',
                            boxShadow: activePerson === person.id ? '0 4px 8px rgba(75, 107, 214, 0.4)' : 'none',
                        }
                    }}
                >
                    {person.label}
                </Button>
            ))}
        </Box>
    );
};
