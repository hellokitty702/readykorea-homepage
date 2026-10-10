// Choices of the default application questions (same as the Google Form the site used before).
// New jobs and general applications start from these (lib/apply-forms.ts → DEFAULT_APPLY_FIELDS).

export const POSITIONS = ['English Kindergarten', 'Elementary Hagwon', 'Adult Academy'] as const;
export const REGIONS = ['Seoul', 'Gyeonggi', 'Busan', 'Other regions'] as const;
export const EXPERIENCE = ['No experience', '1-2 years', '3-5 years', '5+ years'] as const;
export const PASSPORT_COUNTRIES = [
  'USA',
  'Canada',
  'UK',
  'Australia',
  'New Zealand',
  'Ireland',
  'South Africa',
] as const;
