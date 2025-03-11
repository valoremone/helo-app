#!/usr/bin/env node
/**
 * Script to check for conflicting dependencies and package versions
 * Run with: node scripts/check-conflicts.mjs
 */

import { readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  try {
    console.log('🔍 Analyzing package dependencies for conflicts...');
    
    // Read package.json
    const packageJsonContent = await readFile('package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Combine all dependencies
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    // Check for React compatibility issues
    const reactVersion = allDependencies['react'];
    console.log(`\n📦 React version: ${reactVersion}`);
    
    // List of packages that might have React version compatibility issues
    const reactCompatibilityCheck = [
      '@tanstack/react-query',
      'react-router-dom',
      'react-hook-form',
      'react-redux',
      'react-day-picker',
      'recharts',
      'react-big-calendar'
    ];
    
    console.log('\n🧪 Checking for React compatibility issues:');
    for (const pkg of reactCompatibilityCheck) {
      if (allDependencies[pkg]) {
        console.log(`  - ${pkg}: ${allDependencies[pkg]}`);
      }
    }
    
    // Check for duplicate UI libraries
    console.log('\n🎨 Checking for potentially conflicting UI libraries:');
    const uiLibraries = [
      '@radix-ui/react-',
      'shadcn',
      '@headlessui',
      'mui',
      '@material-ui',
      'antd',
      'chakra',
      'evergreen',
      'grommet',
      'blueprint',
      'semantic-ui',
      'rsuite',
      'primereact',
      'bootstrap'
    ];
    
    const foundUiLibraries = new Map();
    
    for (const [dependency, version] of Object.entries(allDependencies)) {
      for (const library of uiLibraries) {
        if (dependency.startsWith(library) || dependency === library) {
          // Group by library prefix
          const prefix = library;
          if (!foundUiLibraries.has(prefix)) {
            foundUiLibraries.set(prefix, []);
          }
          foundUiLibraries.get(prefix).push({ name: dependency, version });
          break;
        }
      }
    }
    
    for (const [library, packages] of foundUiLibraries.entries()) {
      console.log(`  📚 ${library} (${packages.length} packages):`);
      for (const pkg of packages) {
        console.log(`    - ${pkg.name}@${pkg.version}`);
      }
    }
    
    // Check for npm dependency tree issues
    console.log('\n🌲 Analyzing dependency tree for peer dependency issues...');
    try {
      const { stdout: npmLsOutput } = await execAsync('npm ls --json');
      const npmLsJson = JSON.parse(npmLsOutput);
      
      if (npmLsJson.problems) {
        console.log('  ⚠️ Dependency issues found:');
        for (const problem of npmLsJson.problems) {
          console.log(`    - ${problem}`);
        }
      } else {
        console.log('  ✅ No immediate dependency issues found.');
      }
    } catch (error) {
      // The command may exit with an error if there are dependency issues
      if (error.stdout) {
        try {
          const npmLsJson = JSON.parse(error.stdout);
          if (npmLsJson.problems) {
            console.log('  ⚠️ Dependency issues found:');
            for (const problem of npmLsJson.problems) {
              console.log(`    - ${problem}`);
            }
          }
        } catch (parseError) {
          console.log('  ❌ Error parsing dependency tree:', error.message);
        }
      } else {
        console.log('  ❌ Error checking dependency tree:', error.message);
      }
    }
    
    // Check for unused dependencies
    console.log('\n🧹 Checking for potentially unused dependencies...');
    
    // List of commonly over-included dependencies
    const potentialUnused = [
      'lodash',
      'moment',
      'axios',
      'jquery',
      'prop-types',
      '@types/react-native',
      'enzyme',
      'react-test-renderer'
    ];
    
    for (const pkg of potentialUnused) {
      if (allDependencies[pkg]) {
        // Check if it's actually used
        try {
          const grepResult = await execAsync(`grep -r "${pkg}" --include="*.ts*" --include="*.js*" src/`);
          const usageCount = grepResult.stdout.split('\n').filter(Boolean).length;
          if (usageCount === 0) {
            console.log(`  ❌ ${pkg} is installed but might not be used`);
          } else {
            console.log(`  ✅ ${pkg} is used in ${usageCount} places`);
          }
        } catch (error) {
          // grep returns non-zero when no matches are found
          console.log(`  ❌ ${pkg} is installed but might not be used`);
        }
      }
    }
    
    // Check for dependencies with multiple versions
    console.log('\n📊 Checking installed dependency versions...');
    try {
      const { stdout: npmListOutput } = await execAsync('npm list --depth=0 --json');
      const installedDeps = JSON.parse(npmListOutput);
      
      if (installedDeps.dependencies) {
        // Create a map of package name to declared version
        const declaredVersions = new Map();
        for (const [name, version] of Object.entries(allDependencies)) {
          declaredVersions.set(name, version);
        }
        
        // Compare with installed versions
        for (const [name, details] of Object.entries(installedDeps.dependencies)) {
          const declared = declaredVersions.get(name);
          if (declared && details.version && !details.version.includes(declared.replace(/[^0-9.]/g, ''))) {
            console.log(`  ⚠️ ${name}: declared ${declared}, installed ${details.version}`);
          }
        }
      }
    } catch (error) {
      console.log('  ❌ Error checking installed versions:', error.message);
    }
    
    console.log('\n✨ Analysis complete!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 