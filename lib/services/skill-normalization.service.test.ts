/**
 * Skill Normalization Service Tests
 * Manual test file - run with: npx tsx lib/services/skill-normalization.service.test.ts
 * 
 * Tests normalization rules and matching strategies
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  normalizeSkillName,
  findMatchingUserSkill,
  type SkillMatchResult,
} from './skill-normalization.service';

// Test utilities
let passCount = 0;
let failCount = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passCount++;
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    failCount++;
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function assertEquals<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'}: expected ${expected}, got ${actual}`);
  }
}

function assertMatches(
  reqSkill: string,
  userSkills: Array<{ id: string; skill_name: string }>,
  expectedMatchType: string,
  expectedConfidence?: string
) {
  const result = findMatchingUserSkill(reqSkill, userSkills);
  assertEquals(result.matchType, expectedMatchType, `Match type for "${reqSkill}"`);
  if (expectedConfidence) {
    assertEquals(result.confidence, expectedConfidence, `Confidence for "${reqSkill}"`);
  }
}

function assertNoMatch(
  reqSkill: string,
  userSkills: Array<{ id: string; skill_name: string }>
) {
  const result = findMatchingUserSkill(reqSkill, userSkills);
  assertEquals(result.matchType, 'none', `Should not match "${reqSkill}"`);
  assertEquals(result.skill, null, `Skill should be null for "${reqSkill}"`);
}

// ============================================================================
// NORMALIZATION TESTS
// ============================================================================

console.log('\n=== NORMALIZATION TESTS ===\n');

test('normalizes Python correctly', () => {
  assertEquals(normalizeSkillName('Python'), 'python');
});

test('normalizes python (lowercase) correctly', () => {
  assertEquals(normalizeSkillName('python'), 'python');
});

test('trims whitespace from Python', () => {
  assertEquals(normalizeSkillName('  Python  '), 'python');
});

test('normalizes React.js to reactjs', () => {
  assertEquals(normalizeSkillName('React.js'), 'reactjs');
});

test('normalizes ReactJS to reactjs', () => {
  assertEquals(normalizeSkillName('ReactJS'), 'reactjs');
});

test('normalizes Node.js to nodejs', () => {
  assertEquals(normalizeSkillName('Node.js'), 'nodejs');
});

test('normalizes NodeJS to nodejs', () => {
  assertEquals(normalizeSkillName('NodeJS'), 'nodejs');
});

test('normalizes Node JS to nodejs', () => {
  assertEquals(normalizeSkillName('Node JS'), 'nodejs');
});

test('normalizes JavaScript correctly', () => {
  assertEquals(normalizeSkillName('JavaScript'), 'javascript');
});

test('normalizes Javascript correctly', () => {
  assertEquals(normalizeSkillName('Javascript'), 'javascript');
});

test('normalizes C++ to cplusplus', () => {
  assertEquals(normalizeSkillName('C++'), 'cplusplus');
});

test('normalizes C# to csharp', () => {
  assertEquals(normalizeSkillName('C#'), 'csharp');
});

test('collapses multiple spaces', () => {
  assertEquals(normalizeSkillName('Python   Programming'), 'pythonprogramming');
});

// ============================================================================
// EXACT MATCH TESTS
// ============================================================================

console.log('\n=== EXACT MATCH TESTS ===\n');

test('matches Python ↔ Python', () => {
  assertMatches(
    'Python',
    [{ id: '1', skill_name: 'Python' }],
    'normalized',
    'high'
  );
});

test('matches Python ↔ python (case insensitive)', () => {
  assertMatches(
    'Python',
    [{ id: '1', skill_name: 'python' }],
    'normalized',
    'high'
  );
});

test('matches Python ↔ " Python " (trimmed)', () => {
  assertMatches(
    'Python',
    [{ id: '1', skill_name: '  Python  ' }],
    'normalized',
    'high'
  );
});

// ============================================================================
// ALIAS MATCH TESTS
// ============================================================================

console.log('\n=== ALIAS MATCH TESTS ===\n');

test('matches React ↔ React.js (known alias)', () => {
  assertMatches(
    'React',
    [{ id: '1', skill_name: 'React.js' }],
    'alias',
    'high'
  );
});

test('matches React ↔ ReactJS (known alias)', () => {
  assertMatches(
    'React',
    [{ id: '1', skill_name: 'ReactJS' }],
    'alias',
    'high'
  );
});

test('matches Node.js ↔ NodeJS (normalized or alias)', () => {
  const result = findMatchingUserSkill('Node.js', [{ id: '1', skill_name: 'NodeJS' }]);
  // After normalization, both become 'nodejs', so this is normalized match
  if (result.matchType !== 'normalized' && result.matchType !== 'alias') {
    throw new Error(`Expected normalized or alias, got ${result.matchType}`);
  }
  assertEquals(result.confidence, 'high');
});

test('matches Node.js ↔ Node JS (normalized or alias)', () => {
  const result = findMatchingUserSkill('Node.js', [{ id: '1', skill_name: 'Node JS' }]);
  // After normalization, both become 'nodejs', so this is normalized match
  if (result.matchType !== 'normalized' && result.matchType !== 'alias') {
    throw new Error(`Expected normalized or alias, got ${result.matchType}`);
  }
  assertEquals(result.confidence, 'high');
});

// ============================================================================
// PARTIAL MATCH TESTS
// ============================================================================

console.log('\n=== PARTIAL MATCH TESTS ===\n');

test('matches Python ↔ Python Programming (partial)', () => {
  assertMatches(
    'Python',
    [{ id: '1', skill_name: 'Python Programming' }],
    'partial',
    'medium'
  );
});

test('matches React ↔ React Development (partial)', () => {
  assertMatches(
    'React',
    [{ id: '1', skill_name: 'React Development' }],
    'partial',
    'medium'
  );
});

// ============================================================================
// DANGEROUS MISMATCH TESTS (MUST NOT MATCH)
// ============================================================================

console.log('\n=== DANGEROUS MISMATCH TESTS ===\n');

test('MUST NOT match Java ↔ JavaScript', () => {
  assertNoMatch('Java', [{ id: '1', skill_name: 'JavaScript' }]);
});

test('MUST NOT match C ↔ C++', () => {
  assertNoMatch('C', [{ id: '1', skill_name: 'C++' }]);
});

test('MUST NOT match C ↔ C#', () => {
  assertNoMatch('C', [{ id: '1', skill_name: 'C#' }]);
});

test('MUST NOT match SQL ↔ NoSQL', () => {
  assertNoMatch('SQL', [{ id: '1', skill_name: 'NoSQL' }]);
});

test('MUST NOT match ML ↔ HTML', () => {
  assertNoMatch('ML', [{ id: '1', skill_name: 'HTML' }]);
});

test('MUST NOT match React ↔ Angular', () => {
  assertNoMatch('React', [{ id: '1', skill_name: 'Angular' }]);
});

test('MUST NOT match Python ↔ Java', () => {
  assertNoMatch('Python', [{ id: '1', skill_name: 'Java' }]);
});

// ============================================================================
// AMBIGUOUS MATCH TESTS
// ============================================================================

console.log('\n=== AMBIGUOUS MATCH TESTS ===\n');

test('detects ambiguity: Python with multiple matches', () => {
  const result = findMatchingUserSkill('Python', [
    { id: '1', skill_name: 'Python' },
    { id: '2', skill_name: 'Python' },
  ]);
  assertEquals(result.matchType, 'ambiguous');
  assertEquals(result.confidence, 'low');
  assertEquals(result.skill, null);
});

test('detects ambiguity: Python requirement with Python and Python Programming', () => {
  const result = findMatchingUserSkill('Python', [
    { id: '1', skill_name: 'Python' },
    { id: '2', skill_name: 'Python Programming' },
  ]);
  // Python exact match should win over Python Programming partial
  assertEquals(result.matchType, 'normalized');
  assertEquals(result.skill?.id, '1');
});

test('detects ambiguity: React with multiple alias matches', () => {
  const result = findMatchingUserSkill('React', [
    { id: '1', skill_name: 'React.js' },
    { id: '2', skill_name: 'ReactJS' },
  ]);
  assertEquals(result.matchType, 'ambiguous');
  assertEquals(result.confidence, 'low');
});

// ============================================================================
// NO MATCH TESTS
// ============================================================================

console.log('\n=== NO MATCH TESTS ===\n');

test('returns none for Rust when user has Python', () => {
  assertNoMatch('Rust', [{ id: '1', skill_name: 'Python' }]);
});

test('returns none for Docker when user has nothing', () => {
  assertNoMatch('Docker', []);
});

test('returns none for Kubernetes when user has Docker', () => {
  assertNoMatch('Kubernetes', [{ id: '1', skill_name: 'Docker' }]);
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

console.log('\n=== EDGE CASE TESTS ===\n');

test('handles empty requirement string', () => {
  const result = findMatchingUserSkill('', [{ id: '1', skill_name: 'Python' }]);
  assertEquals(result.matchType, 'none');
});

test('handles empty user skills array', () => {
  const result = findMatchingUserSkill('Python', []);
  assertEquals(result.matchType, 'none');
  assertEquals(result.skill, null);
});

test('handles special characters in skill name', () => {
  assertEquals(normalizeSkillName('C++'), 'cplusplus');
  assertEquals(normalizeSkillName('C#'), 'csharp');
  assertEquals(normalizeSkillName('.NET'), 'net');
});

test('handles very long skill names', () => {
  const longName = 'Advanced Machine Learning with Deep Neural Networks and TensorFlow';
  const normalized = normalizeSkillName(longName);
  assertEquals(normalized.includes(' '), false, 'Should not contain spaces');
});

// ============================================================================
// REALISTIC SCENARIO TESTS
// ============================================================================

console.log('\n=== REALISTIC SCENARIO TESTS ===\n');

test('Scenario: User has "Python Programming", requirement is "Python"', () => {
  const userSkills = [
    { id: '1', skill_name: 'Python Programming' },
    { id: '2', skill_name: 'JavaScript' },
    { id: '3', skill_name: 'React' },
  ];
  
  const result = findMatchingUserSkill('Python', userSkills);
  assertEquals(result.matchType, 'partial');
  assertEquals(result.skill?.id, '1');
  assertEquals(result.confidence, 'medium');
});

test('Scenario: User has "React.js", requirement is "React"', () => {
  const userSkills = [
    { id: '1', skill_name: 'React.js' },
    { id: '2', skill_name: 'Vue.js' },
  ];
  
  const result = findMatchingUserSkill('React', userSkills);
  assertEquals(result.matchType, 'alias');
  assertEquals(result.skill?.id, '1');
  assertEquals(result.confidence, 'high');
});

test('Scenario: User has "NodeJS", requirement is "Node.js"', () => {
  const userSkills = [
    { id: '1', skill_name: 'NodeJS' },
    { id: '2', skill_name: 'Express' },
  ];
  
  const result = findMatchingUserSkill('Node.js', userSkills);
  // After normalization, both become 'nodejs'
  if (result.matchType !== 'normalized' && result.matchType !== 'alias') {
    throw new Error(`Expected normalized or alias, got ${result.matchType}`);
  }
  assertEquals(result.skill?.id, '1');
});

test('Scenario: User has "Java", requirement is "JavaScript" - should NOT match', () => {
  const userSkills = [
    { id: '1', skill_name: 'Java' },
    { id: '2', skill_name: 'Spring Boot' },
  ];
  
  const result = findMatchingUserSkill('JavaScript', userSkills);
  assertEquals(result.matchType, 'none');
  assertEquals(result.skill, null);
});

test('Scenario: Multiple skills, find correct one', () => {
  const userSkills = [
    { id: '1', skill_name: 'Python' },
    { id: '2', skill_name: 'JavaScript' },
    { id: '3', skill_name: 'Java' },
    { id: '4', skill_name: 'C++' },
  ];
  
  const pythonResult = findMatchingUserSkill('Python', userSkills);
  assertEquals(pythonResult.skill?.id, '1');
  
  const jsResult = findMatchingUserSkill('JavaScript', userSkills);
  assertEquals(jsResult.skill?.id, '2');
  
  const cppResult = findMatchingUserSkill('C++', userSkills);
  assertEquals(cppResult.skill?.id, '4');
});

// ============================================================================
// FINAL REPORT
// ============================================================================

console.log('\n=== TEST RESULTS ===\n');
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total: ${passCount + failCount}`);

if (failCount === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failCount} test(s) failed`);
  process.exit(1);
}
