#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ALL_CHECKS = [
  // Sign-in and sessions (7)
  'AC-1.1.1', 'AC-1.1.3', 'AC-1.1.4', 'AC-1.6.1', 'AC-1.6.2', 'AC-1.6.3', 'AC-1.6.4',
  // Home page (15)
  'AC-2.1.1', 'AC-2.1.2', 'AC-2.1.3', 'AC-2.1.4', 'AC-2.1.5', 'AC-2.1.6',
  'AC-2.2.1', 'AC-2.2.2', 'AC-2.2.3', 'AC-2.2.4',
  'AC-2.3.1', 'AC-2.3.2',
  'AC-2.4.1', 'AC-2.4.2', 'AC-2.4.3',
  // Squad and profiles (9)
  'AC-4.1.1', 'AC-4.1.2', 'AC-4.1.3',
  'AC-4.2.1', 'AC-4.2.2',
  'AC-4.3.1', 'AC-4.3.2', 'AC-4.3.3', 'AC-4.3.4',
  // Going / Not going (7)
  'AC-3.3.1', 'AC-3.3.2', 'AC-3.3.4', 'AC-3.3.5', 'AC-3.3.6',
  'AC-3.4.1', 'AC-3.4.3',
  // Design Quality Gates (2)
  'AC-5.2', 'AC-5.4'
];

const plansDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(process.cwd(), 'plans');

if (!fs.existsSync(plansDir)) {
  console.error(`Error: Plans directory does not exist: ${plansDir}`);
  process.exit(1);
}

const files = fs.readdirSync(plansDir)
  .filter(f => f.startsWith('session-') && f.endsWith('.md'))
  .sort();

if (files.length === 0) {
  console.error(`Error: No session plan files found in ${plansDir}`);
  process.exit(1);
}

let hasErrors = false;
const errors = [];
const checkOwners = new Map();

for (const file of files) {
  const filePath = path.join(plansDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract session number
  const matchNum = file.match(/^session-(\d+)/);
  if (!matchNum) {
    errors.push(`${file}: Invalid filename format, must start with session-NN`);
    hasErrors = true;
    continue;
  }
  const sessionNum = parseInt(matchNum[1], 10);

  // Check: Depends on
  const dependsOnMatch = content.match(/## Depends on\s*([\s\S]*?)(?=##|$)/i);
  if (!dependsOnMatch) {
    errors.push(`${file}: Missing '## Depends on' section`);
    hasErrors = true;
  } else {
    const dependsText = dependsOnMatch[1].trim();
    const depNumbers = [...dependsText.matchAll(/session\s*(\d+)/gi)].map(m => parseInt(m[1], 10));
    for (const depNum of depNumbers) {
      if (depNum >= sessionNum) {
        errors.push(`${file} (Session ${sessionNum}) depends on a later or equal session: Session ${depNum}`);
        hasErrors = true;
      }
    }
  }

  // Check: Exit gate
  const exitGateMatch = content.match(/## Exit gate\s*([\s\S]*?)(?=##|$)/i);
  if (!exitGateMatch || exitGateMatch[1].trim() === '' || exitGateMatch[1].trim().toLowerCase() === 'none') {
    errors.push(`${file}: Missing or empty '## Exit gate' section`);
    hasErrors = true;
  } else {
    const codeBlockMatch = exitGateMatch[1].match(/```(?:bash|sh)?\s*([\s\S]*?)```/);
    if (!codeBlockMatch || codeBlockMatch[1].trim() === '') {
      errors.push(`${file}: Exit gate has no executable command block`);
      hasErrors = true;
    }
  }

  // Check: Checks it owns
  const checksMatch = content.match(/## Checks it owns\s*([\s\S]*?)(?=##|$)/i);
  if (!checksMatch) {
    errors.push(`${file}: Missing '## Checks it owns' section`);
    hasErrors = true;
  } else {
    const checksText = checksMatch[1].trim();
    const ownedChecks = [...checksText.matchAll(/AC-\d+\.\d+(?:\.\d+)?/g)].map(m => m[0]);

    for (const check of ownedChecks) {
      if (checkOwners.has(check)) {
        errors.push(`Check ${check} has TWO owners: ${checkOwners.get(check)} and ${file}`);
        hasErrors = true;
      } else {
        checkOwners.set(check, file);
      }
    }
  }
}

// Check: Verify every check has an owner
for (const check of ALL_CHECKS) {
  if (!checkOwners.has(check)) {
    errors.push(`Check ${check} has NO owner in any session plan!`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\n❌ Plan check FAILED with the following errors:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(`\n✅ Plan check PASSED:`);
  console.log(`  - Verified ${files.length} session plan files`);
  console.log(`  - All ${ALL_CHECKS.length} checks (38 MVP checks + 2 quality gates) have exactly one owner`);
  console.log(`  - Dependency ordering is strictly valid (no sessions depend on later ones)`);
  console.log(`  - Every session plan has a valid executable exit gate`);
  process.exit(0);
}
