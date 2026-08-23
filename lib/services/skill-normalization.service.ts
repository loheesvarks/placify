/**
 * Skill Normalization Service
 * Critical Fix: Phase 3 Post-Audit
 * 
 * Provides deterministic, conservative, safe matching between:
 * - Canonical skill names (from role_requirements)
 * - User skill names (from skills table)
 * 
 * PRINCIPLES:
 * - Uncertainty > False Certainty
 * - Never fabricate a match
 * - Never silently merge different skills
 * - Ambiguous cases must be explicit
 * - Dangerous partial matches rejected
 * 
 * VERSION: v1.0.0
 */

/**
 * Match confidence levels
 */
export type MatchConfidence = 'high' | 'medium' | 'low';

/**
 * Match types
 */
export type MatchType = 
  | 'exact'         // Exact skill_id match (already known)
  | 'normalized'    // Normalized name match
  | 'alias'         // Known technology alias
  | 'partial'       // Conservative partial match
  | 'ambiguous'     // Multiple potential matches
  | 'none';         // No match found

/**
 * Skill match result
 */
export interface SkillMatchResult {
  skill: { id: string; skill_name: string } | null;
  matchType: MatchType;
  confidence: MatchConfidence;
  explanation?: string;
}

/**
 * Known technology aliases
 * Maps canonical name → known variations
 */
const KNOWN_ALIASES: Record<string, string[]> = {
  // JavaScript ecosystem
  'javascript': ['js', 'ecmascript'],
  'typescript': ['ts'],
  'nodejs': ['node.js', 'node js', 'node'],
  'reactjs': ['react.js', 'react js', 'react'],
  'nextjs': ['next.js', 'next js', 'next'],
  'vuejs': ['vue.js', 'vue js', 'vue'],
  'angularjs': ['angular.js', 'angular js', 'angular'],
  
  // Python ecosystem
  'python': ['py'],
  
  // Java ecosystem
  'java': [],
  
  // C family
  'cplusplus': ['c++'],
  'csharp': ['c#'],
  
  // Databases
  'postgresql': ['postgres', 'psql'],
  'mongodb': ['mongo'],
  
  // Cloud
  'amazonaws': ['aws'],
  'googlecloud': ['gcp'],
  'azurecloud': ['azure'],
  
  // Other
  'kubernetes': ['k8s'],
  'docker': [],
};

/**
 * Dangerous partial matches that should NEVER auto-match
 * These look similar but are different technologies
 */
const DANGEROUS_PARTIAL_MATCHES: [string, string][] = [
  ['java', 'javascript'],
  ['c', 'c++'],
  ['c', 'c#'],
  ['sql', 'nosql'],
  ['ml', 'html'],
  ['ml', 'xml'],
  ['react', 'angular'],
  ['vue', 'react'],
  ['python', 'java'],
  ['node', 'deno'],
  ['rust', 'ruby'],
  ['go', 'golang'], // Actually same, but need explicit handling
];

/**
 * Normalize skill name for matching
 * 
 * Rules:
 * 1. Lowercase
 * 2. Trim whitespace
 * 3. Collapse multiple spaces to single space
 * 4. Remove common punctuation (dots, hyphens)
 * 5. Normalize C++, C# safely
 * 6. Normalize .js suffix patterns
 * 
 * @param skillName - Raw skill name
 * @returns Normalized skill name
 */
export function normalizeSkillName(skillName: string): string {
  return skillName
    .toLowerCase()
    .trim()
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    // Normalize C++, C#
    .replace(/c\+\+/g, 'cplusplus')
    .replace(/c#/g, 'csharp')
    // Remove dots (React.js → reactjs, Node.js → nodejs)
    .replace(/\./g, '')
    // Remove hyphens
    .replace(/-/g, '')
    // Normalize remaining spaces to empty (Node js → nodejs)
    .replace(/\s+/g, '');
}

/**
 * Check if two normalized names are a known dangerous mismatch
 * 
 * @param normalized1 - First normalized name
 * @param normalized2 - Second normalized name
 * @returns True if this is a known dangerous match
 */
function isDangerousMatch(normalized1: string, normalized2: string): boolean {
  for (const [danger1, danger2] of DANGEROUS_PARTIAL_MATCHES) {
    const norm1 = normalizeSkillName(danger1);
    const norm2 = normalizeSkillName(danger2);
    
    if (
      (normalized1 === norm1 && normalized2 === norm2) ||
      (normalized1 === norm2 && normalized2 === norm1)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a skill name matches a known alias
 * 
 * @param canonical - Canonical name (from role_requirements)
 * @param candidate - Candidate name (from user skills)
 * @returns True if candidate is a known alias of canonical
 */
function isKnownAlias(canonical: string, candidate: string): boolean {
  const canonicalNorm = normalizeSkillName(canonical);
  const candidateNorm = normalizeSkillName(candidate);
  
  // Check if candidate is in the alias list for canonical
  const aliases = KNOWN_ALIASES[canonicalNorm] || [];
  const normalizedAliases = aliases.map(a => normalizeSkillName(a));
  
  return normalizedAliases.includes(candidateNorm);
}

/**
 * Find matching user skill for a requirement skill
 * 
 * Strategy:
 * 1. Exact normalized match (high confidence)
 * 2. Known alias match (high confidence)
 * 3. Conservative partial match (medium confidence)
 * 4. Multiple matches → ambiguous (low confidence)
 * 5. No match → none
 * 
 * @param requirementSkillName - Canonical skill name from role_requirements
 * @param userSkills - User's skills [{id, skill_name}]
 * @returns Match result with skill, type, confidence
 */
export function findMatchingUserSkill(
  requirementSkillName: string,
  userSkills: Array<{ id: string; skill_name: string }>
): SkillMatchResult {
  const reqNormalized = normalizeSkillName(requirementSkillName);
  
  // Phase 1: Exact normalized matches
  const exactMatches = userSkills.filter(
    skill => normalizeSkillName(skill.skill_name) === reqNormalized
  );
  
  if (exactMatches.length === 1) {
    return {
      skill: exactMatches[0],
      matchType: 'normalized',
      confidence: 'high',
      explanation: `Exact match: "${requirementSkillName}" ↔ "${exactMatches[0].skill_name}"`,
    };
  }
  
  if (exactMatches.length > 1) {
    return {
      skill: null,
      matchType: 'ambiguous',
      confidence: 'low',
      explanation: `Multiple exact matches found for "${requirementSkillName}": ${exactMatches.map(s => `"${s.skill_name}"`).join(', ')}`,
    };
  }
  
  // Phase 2: Known alias matches
  const aliasMatches = userSkills.filter(
    skill => isKnownAlias(requirementSkillName, skill.skill_name) || 
             isKnownAlias(skill.skill_name, requirementSkillName)
  );
  
  if (aliasMatches.length === 1) {
    return {
      skill: aliasMatches[0],
      matchType: 'alias',
      confidence: 'high',
      explanation: `Known alias: "${requirementSkillName}" ↔ "${aliasMatches[0].skill_name}"`,
    };
  }
  
  if (aliasMatches.length > 1) {
    return {
      skill: null,
      matchType: 'ambiguous',
      confidence: 'low',
      explanation: `Multiple alias matches found for "${requirementSkillName}": ${aliasMatches.map(s => `"${s.skill_name}"`).join(', ')}`,
    };
  }
  
  // Phase 3: Conservative partial matching
  // Only match if requirement is contained in user skill AND not dangerous
  const partialMatches = userSkills.filter(skill => {
    const userNorm = normalizeSkillName(skill.skill_name);
    
    // Check if requirement is a substring of user skill
    // E.g., "Python" matches "Python Programming"
    const reqInUser = userNorm.includes(reqNormalized);
    
    // Check if it's not a dangerous match
    const notDangerous = !isDangerousMatch(reqNormalized, userNorm);
    
    // Require minimum length to avoid single-char matches
    const minLength = reqNormalized.length >= 3;
    
    return reqInUser && notDangerous && minLength;
  });
  
  if (partialMatches.length === 1) {
    return {
      skill: partialMatches[0],
      matchType: 'partial',
      confidence: 'medium',
      explanation: `Partial match: "${requirementSkillName}" found in "${partialMatches[0].skill_name}"`,
    };
  }
  
  if (partialMatches.length > 1) {
    return {
      skill: null,
      matchType: 'ambiguous',
      confidence: 'low',
      explanation: `Multiple partial matches found for "${requirementSkillName}": ${partialMatches.map(s => `"${s.skill_name}"`).join(', ')}`,
    };
  }
  
  // Phase 4: No match found
  return {
    skill: null,
    matchType: 'none',
    confidence: 'low',
    explanation: `No match found for "${requirementSkillName}"`,
  };
}

/**
 * Batch find matches for multiple requirements
 * More efficient than calling findMatchingUserSkill repeatedly
 * 
 * @param requirements - Array of requirement skill names
 * @param userSkills - User's skills
 * @returns Map of requirement skill name → match result
 */
export function findMatchingUserSkills(
  requirements: string[],
  userSkills: Array<{ id: string; skill_name: string }>
): Map<string, SkillMatchResult> {
  const matchMap = new Map<string, SkillMatchResult>();
  
  for (const reqSkillName of requirements) {
    const match = findMatchingUserSkill(reqSkillName, userSkills);
    matchMap.set(reqSkillName, match);
  }
  
  return matchMap;
}

/**
 * Get all ambiguous matches from a batch result
 * Useful for logging/debugging
 * 
 * @param matchResults - Map from findMatchingUserSkills
 * @returns Array of requirement names with ambiguous matches
 */
export function getAmbiguousMatches(
  matchResults: Map<string, SkillMatchResult>
): string[] {
  const ambiguous: string[] = [];
  
  for (const [reqName, result] of matchResults.entries()) {
    if (result.matchType === 'ambiguous') {
      ambiguous.push(reqName);
    }
  }
  
  return ambiguous;
}

/**
 * Get all unmatched requirements
 * Useful for identifying true gaps
 * 
 * @param matchResults - Map from findMatchingUserSkills
 * @returns Array of requirement names with no match
 */
export function getUnmatchedRequirements(
  matchResults: Map<string, SkillMatchResult>
): string[] {
  const unmatched: string[] = [];
  
  for (const [reqName, result] of matchResults.entries()) {
    if (result.matchType === 'none') {
      unmatched.push(reqName);
    }
  }
  
  return unmatched;
}
