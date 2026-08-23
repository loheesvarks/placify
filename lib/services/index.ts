/**
 * Services barrel exports
 * Centralized service layer access
 */

export { authService } from './auth.service';
export type { IAuthService } from './auth.service';

export { dashboardService } from './dashboard.service';
export type { IDashboardService } from './dashboard.service';

export { onboardingService } from './onboarding.service';
export type { IOnboardingService, OnboardingStatusResponse, OnboardingResponse } from './onboarding.service';

export { placifyContextService } from './placify-context.service';
export type { PlacifyContext, PlacifyContextSummary } from './placify-context.service';

export { targetRoleService } from './target-role.service';
export type { TargetRoleWithRequirements, AvailableRole } from './target-role.service';

export { skillEvidenceService } from './skill-evidence.service';
export type { 
  EvidenceType,
  EvidenceCaptureResult,
  LessonCompletionMetadata,
  QuizScoreMetadata,
  CodingProblemMetadata,
  ProjectMetadata,
  InterviewMetadata,
  SelfReportedMetadata
} from './skill-evidence.service';

export { skillAssessmentService } from './skill-assessment.service';
export type {
  DemonstratedLevel,
  ConfidenceLevel,
  AssessmentCalculation
} from './skill-assessment.service';

export { skillGapService } from './skill-gap.service';
export type {
  GapSize,
  UrgencyLevel,
  GapCalculation
} from './skill-gap.service';

export { recommendationService } from './recommendation.service';
export type {
  RecommendationType,
  RecommendationPriority,
  RecommendationGeneration
} from './recommendation.service';

export { 
  normalizeSkillName,
  findMatchingUserSkill,
  findMatchingUserSkills,
  getAmbiguousMatches,
  getUnmatchedRequirements
} from './skill-normalization.service';
export type {
  MatchConfidence,
  MatchType,
  SkillMatchResult
} from './skill-normalization.service';
