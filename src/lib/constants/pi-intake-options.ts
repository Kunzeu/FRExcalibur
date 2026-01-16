
export const BEHALF_OPTIONS = [
    'Pending', 'Himself/Herself', 'Legal Spouse', 'Son/Daughter',
    'Son/Daughter(Minor)', 'Parent', 'Sibling', 'Friend', 'Other'
];

export const INJURY_OPTIONS = [
    // Head, Neck, Back (Central body parts)
    { label: 'Head pain', key: 'headPain' },
    { label: 'Neck pain', key: 'neckPain' },
    { label: 'Back Pain', key: 'backPain' },
    { label: 'Lower Back Pain', key: 'lowerBackPain' },

    // Right side extremities
    { label: 'Right shoulder pain', key: 'rightShoulderPain' },
    { label: 'Right arm pain radiating', key: 'rightArmPainRadiating' },
    { label: 'Right knee pain', key: 'rightKneePain' },
    { label: 'Right leg pain radiating', key: 'rightLegPainRadiating' },

    // Left side extremities
    { label: 'Left shoulder pain', key: 'leftShoulderPain' },
    { label: 'Left arm pain radiating', key: 'leftArmPainRadiating' },
    { label: 'Left knee pain', key: 'leftKneePain' },
    { label: 'Left leg pain radiating', key: 'leftLegPainRadiating' },

    // Other injuries
    { label: 'Lost / broken teeth', key: 'lostBrokenTeeth', hasInput: true, inputLabel: 'Missing/Broken Teeth?', inputKey: 'teethDetails' },
    { label: 'Laceration stitches', key: 'lacerationStitches', hasInput: true, inputLabel: 'Number of Stitches and Location?', inputKey: 'stitchesDetails' },
    { label: 'Multiple contusions', key: 'multipleContusions' },
    { label: 'Fractured bone', key: 'fracturedBone', hasInput: true, inputLabel: 'What bones are fracture?', inputKey: 'fractureBonesDetails' },
    { label: 'Admitted to Hospital', key: 'admittedToHospital', hasInput: true, inputLabel: 'Which Hospital and for how many days?', inputKey: 'hospitalDays' },
    { label: 'Surgery', key: 'surgery', hasInput: true, inputLabel: 'Type of Surgery?', inputKey: 'surgeryDetails' },
    { label: 'Other', key: 'otherInjury', hasInput: true, inputLabel: 'What other type of injury?', inputKey: 'otherInjuryDetails' },
];

export const NATIONALITY_OPTIONS = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)',
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'East Timor (Timor-Leste)', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini (fmr. "Swaziland")', 'Ethiopia',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe',
    'Other'
];
