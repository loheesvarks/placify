import { z } from 'zod';

/**
 * Onboarding validation schemas
 */

// Personal Information Schema (Step 2)
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  college: z
    .string()
    .min(2, 'College name must be at least 2 characters')
    .max(200, 'College name must be less than 200 characters'),
  degree: z
    .string()
    .min(1, 'Please select a degree'),
  department: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name must be less than 100 characters'),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Education Schema (Step 3)
export const educationSchema = z.object({
  currentYear: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Year must be between 1 and 5')
    .max(5, 'Year must be between 1 and 5'),
  graduationYear: z
    .number()
    .int('Must be a whole number')
    .min(2024, 'Graduation year must be in the future')
    .max(2030, 'Graduation year seems too far in the future'),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// Career Goal Schema (Step 4)
export const careerGoalSchema = z.object({
  preferredRole: z
    .string()
    .min(2, 'Please select or enter a role')
    .max(100, 'Role name must be less than 100 characters'),
});

export type CareerGoalFormData = z.infer<typeof careerGoalSchema>;

// Target Package Schema (Step 5)
export const targetPackageSchema = z
  .object({
    targetPackageMin: z
      .number()
      .positive('Minimum package must be positive')
      .min(1, 'Minimum package must be at least 1'),
    targetPackageMax: z
      .number()
      .positive('Maximum package must be positive')
      .min(1, 'Maximum package must be at least 1'),
    currency: z
      .string()
      .min(1, 'Please select a currency'),
  })
  .refine((data) => data.targetPackageMax >= data.targetPackageMin, {
    message: 'Maximum package must be greater than or equal to minimum package',
    path: ['targetPackageMax'],
  });

export type TargetPackageFormData = z.infer<typeof targetPackageSchema>;

// Technology Interests Schema (Step 6)
export const technologyInterestsSchema = z.object({
  preferredTechStack: z
    .array(z.string())
    .min(1, 'Please select at least one technology')
    .max(15, 'Please select no more than 15 technologies'),
});

export type TechnologyInterestsFormData = z.infer<typeof technologyInterestsSchema>;

// Current Skills Schema (Step 7)
const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  proficiency: z
    .number()
    .int('Proficiency must be a whole number')
    .min(1, 'Proficiency must be between 1 and 10')
    .max(10, 'Proficiency must be between 1 and 10'),
  category: z.enum(['technical', 'soft', 'domain']),
});

export const currentSkillsSchema = z.object({
  currentSkills: z
    .array(skillSchema)
    .min(3, 'Please add at least 3 skills')
    .max(20, 'Please add no more than 20 skills'),
});

export type CurrentSkillsFormData = z.infer<typeof currentSkillsSchema>;

// Learning Preferences Schema (Step 8)
export const learningPreferencesSchema = z.object({
  weeklyStudyHours: z
    .number()
    .positive('Weekly study hours must be positive')
    .min(1, 'Must commit at least 1 hour per week')
    .max(168, 'Cannot exceed 168 hours in a week'),
  learningGoals: z
    .array(z.string())
    .min(1, 'Please select at least one learning goal')
    .max(10, 'Please select no more than 10 learning goals'),
});

export type LearningPreferencesFormData = z.infer<typeof learningPreferencesSchema>;

// Complete Onboarding Schema
export const completeOnboardingSchema = personalInfoSchema
  .merge(educationSchema)
  .merge(careerGoalSchema)
  .merge(targetPackageSchema)
  .merge(technologyInterestsSchema)
  .merge(currentSkillsSchema)
  .merge(learningPreferencesSchema);

export type CompleteOnboardingData = z.infer<typeof completeOnboardingSchema>;

// Common constants
export const DEGREE_OPTIONS = [
  { value: 'B.Tech', label: 'B.Tech / BE (Bachelor of Technology)' },
  { value: 'B.Sc', label: 'B.Sc (Bachelor of Science)' },
  { value: 'BCA', label: 'BCA (Bachelor of Computer Applications)' },
  { value: 'M.Tech', label: 'M.Tech / ME (Master of Technology)' },
  { value: 'M.Sc', label: 'M.Sc (Master of Science)' },
  { value: 'MCA', label: 'MCA (Master of Computer Applications)' },
  { value: 'MBA', label: 'MBA (Master of Business Administration)' },
  { value: 'Other', label: 'Other' },
];

export const CURRENCY_OPTIONS = [
  { value: 'INR', label: '₹ INR (Indian Rupee)', symbol: '₹' },
  { value: 'USD', label: '$ USD (US Dollar)', symbol: '$' },
  { value: 'EUR', label: '€ EUR (Euro)', symbol: '€' },
  { value: 'GBP', label: '£ GBP (British Pound)', symbol: '£' },
];

export const COMMON_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Data Engineer',
  'Cloud Engineer',
  'Software Engineer',
  'QA Engineer',
  'Product Manager',
  'UI/UX Designer',
  'System Administrator',
  'Security Engineer',
];

export const COMMON_TECHNOLOGIES = [
  // Frontend
  'React',
  'Angular',
  'Vue.js',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'HTML/CSS',
  'Tailwind CSS',
  
  // Backend
  'Node.js',
  'Python',
  'Java',
  'Spring Boot',
  'Django',
  'Flask',
  'Express.js',
  'Go',
  'Rust',
  
  // Databases
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Redis',
  'Elasticsearch',
  
  // Cloud & DevOps
  'AWS',
  'Azure',
  'Google Cloud',
  'Docker',
  'Kubernetes',
  'CI/CD',
  'Terraform',
  
  // Mobile
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  
  // Data & ML
  'TensorFlow',
  'PyTorch',
  'Pandas',
  'Scikit-learn',
  'Apache Spark',
  
  // Others
  'Git',
  'GraphQL',
  'REST APIs',
  'Microservices',
  'System Design',
];

export const LEARNING_GOALS = [
  'Crack coding interviews',
  'Master Data Structures & Algorithms',
  'Learn System Design',
  'Build real-world projects',
  'Improve problem-solving skills',
  'Get placement in top companies',
  'Switch to better role',
  'Learn new technologies',
  'Prepare for competitive programming',
  'Improve communication skills',
];
