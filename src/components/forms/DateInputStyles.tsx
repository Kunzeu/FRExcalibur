'use client';

export const DateInputStyles = () => {
    return (
        <style jsx global>{`
            .date-input-custom::-webkit-calendar-picker-indicator {
                filter: invert(68%) sepia(79%) saturate(1686%) hue-rotate(359deg) brightness(96%) contrast(92%);
                transform: scale(1.5);
                cursor: pointer;
                background-position: center;
                margin-right: -0.5rem;
            }
            .date-input-custom::-webkit-calendar-picker-indicator:hover {
                filter: invert(52%) sepia(98%) saturate(1686%) hue-rotate(359deg) brightness(96%) contrast(92%);
            }
            
            .date-input-custom {
                font-family: inherit;
                min-height: 3rem;
            }

            @media (max-width: 640px) {
                .date-input-custom {
                    appearance: none;
                    -webkit-appearance: none;
                    min-height: 44px;
                }
            }
        `}</style>
    );
};
