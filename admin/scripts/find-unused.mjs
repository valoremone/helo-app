#!/usr/bin/env node
/**
 * Advanced script to find unused components, imports, and files
 * Run with: node scripts/find-unused.mjs
 */

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configure the directories to scan
const directories = [
  'src/components',
  'src/pages',
  'src/layouts',
  'src/lib',
  'src/hooks',
  'src/store',
  'src/utils',
  'src/routes',
];

// Files to consider for deletion if not imported anywhere
const potentialUnusedFiles = [];

// Map to store component usage
const componentUsage = new Map();

async function isImported(filePath, componentName) {
  try {
    const result = await execAsync(`grep -r "${componentName}" --include="*.ts*" src/ | grep -v "${filePath}"`);
    return result.stdout.trim() !== '';
  } catch (error) {
    // grep returns non-zero exit code when no matches are found
    return false;
  }
}

async function findComponentsInFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Extract export declarations
    const exportMatches = content.match(/export\s+(const|function|class|type|interface)\s+([A-Za-z0-9_]+)/g) || [];
    const namedExportMatches = content.match(/export\s+{\s*([^}]+)\s*}/g) || [];
    
    const exports = [];
    
    // Process regular exports
    for (const match of exportMatches) {
      const parts = match.split(/\s+/);
      if (parts.length >= 3) {
        exports.push(parts[2]);
      }
    }
    
    // Process named exports
    for (const match of namedExportMatches) {
      const content = match.replace(/export\s+{\s*/, '').replace(/\s*}/, '');
      const names = content.split(',').map(n => n.trim());
      exports.push(...names);
    }
    
    return exports;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

async function main() {
  console.log('🔍 Scanning for unused components and imports...');
  
  // Step 1: Build a database of all components and their locations
  for (const dir of directories) {
    try {
      // Check if directory exists
      await fs.access(dir);
      
      // Find all TypeScript files in the directory
      const { stdout: files } = await execAsync(`find ${dir} -type f -name "*.ts*"`);
      
      if (!files.trim()) {
        console.log(`  No TypeScript files found in ${dir}`);
        continue;
      }
      
      const fileList = files.trim().split('\n');
      console.log(`  Found ${fileList.length} TypeScript files in ${dir}`);
      
      // Process each file to find components
      for (const file of fileList) {
        const components = await findComponentsInFile(file);
        
        if (components.length > 0) {
          for (const component of components) {
            componentUsage.set(component, {
              file,
              isUsed: null  // Will be updated later
            });
          }
          
          // Add non-index files to potential unused list
          if (!file.endsWith('index.ts') && !file.endsWith('index.tsx')) {
            potentialUnusedFiles.push({
              file,
              components
            });
          }
        }
      }
    } catch (error) {
      console.log(`  Directory ${dir} not found or error:`, error.message);
    }
  }
  
  // Step 2: Check if each component is imported somewhere
  console.log('\n📊 Analyzing component usage:');
  
  let unusedCount = 0;
  
  for (const [component, data] of componentUsage.entries()) {
    const isUsed = await isImported(data.file, component);
    componentUsage.set(component, {
      ...data,
      isUsed
    });
    
    if (!isUsed) {
      unusedCount++;
      console.log(`  ❌ ${component} (in ${data.file}) appears to be unused`);
    }
  }
  
  console.log(`\n🧹 Found ${unusedCount} potentially unused components`);
  
  // Step 3: Identify files that might be completely unused
  console.log('\n📁 Potentially unused files:');
  
  for (const item of potentialUnusedFiles) {
    // Check if all components in the file are unused
    const allUnused = item.components.every(comp => {
      const usage = componentUsage.get(comp);
      return usage && !usage.isUsed;
    });
    
    if (allUnused && item.components.length > 0) {
      console.log(`  🗑️ ${item.file} - All ${item.components.length} components appear to be unused`);
    }
  }
  
  console.log('\n✨ Analysis complete! Review the results carefully before removing any code.');
  console.log('   Some components might be used dynamically or through other means not detected by this script.');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 