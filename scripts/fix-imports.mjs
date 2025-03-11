#!/usr/bin/env node
/**
 * Script to remove unused imports from TypeScript files
 * Run with: node scripts/fix-imports.mjs
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Directories to scan
const DIRECTORIES = [
  'src/components',
  'src/pages',
  'src/layouts',
  'src/lib',
  'src/hooks',
  'src/store',
  'src/utils',
  'src/routes',
];

async function findTsFiles(directory) {
  try {
    const files = await fs.readdir(path.join(projectRoot, directory), { withFileTypes: true });
    const tsFiles = [];

    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        const nestedFiles = await findTsFiles(fullPath);
        tsFiles.push(...nestedFiles);
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        tsFiles.push(fullPath);
      }
    }

    return tsFiles;
  } catch (error) {
    console.log(`Directory ${directory} not found or error: ${error.message}`);
    return [];
  }
}

async function processFile(filePath) {
  try {
    console.log(`  Checking ${filePath}`);
    const fullPath = path.join(projectRoot, filePath);
    const content = await fs.readFile(fullPath, 'utf8');
    
    // Find import statements
    const importRegex = /import\s+(?:{([^}]*)}\s+from\s+['"]([^'"]+)['"]|([^;]*)\s+from\s+['"]([^'"]+)['"])/g;
    let match;
    let importLines = [];
    
    while ((match = importRegex.exec(content)) !== null) {
      if (match[1]) {
        // Named import: import { a, b } from 'module'
        const namedImports = match[1].split(',').map(imp => imp.trim().split(' as ')[0].trim());
        importLines.push({
          line: match[0],
          module: match[2],
          imports: namedImports,
          type: 'named',
          start: match.index,
          end: match.index + match[0].length
        });
      } else if (match[3]) {
        // Default import: import module from 'module'
        importLines.push({
          line: match[0],
          module: match[4],
          imports: [match[3].trim()],
          type: 'default',
          start: match.index,
          end: match.index + match[0].length
        });
      }
    }
    
    if (importLines.length === 0) {
      return false; // No imports to process
    }
    
    // Find usages of imported items
    let unusedImports = [];
    
    importLines.forEach(importInfo => {
      importInfo.imports.forEach(importName => {
        // Skip React import for JSX files
        if (importName === 'React' && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
          return;
        }
        
        // Create regex to find usages, being careful with word boundaries
        const importRegex = new RegExp(`\\b${importName}\\b`, 'g');
        
        // Count occurrences but exclude the import statement itself
        const contentWithoutImport = content.slice(0, importInfo.start) + content.slice(importInfo.end);
        const matches = contentWithoutImport.match(importRegex) || [];
        
        if (matches.length === 0) {
          unusedImports.push(importName);
        }
      });
    });
    
    if (unusedImports.length === 0) {
      return false; // No unused imports
    }
    
    // Process content to remove unused imports
    let newContent = content;
    let modified = false;
    
    for (const imp of importLines) {
      const unusedInThisImport = imp.imports.filter(name => unusedImports.includes(name));
      
      if (unusedInThisImport.length > 0 && unusedInThisImport.length === imp.imports.length) {
        // All imports in this line are unused, remove the whole line
        newContent = newContent.slice(0, imp.start) + newContent.slice(imp.end);
        modified = true;
      } else if (unusedInThisImport.length > 0 && imp.type === 'named') {
        // Some named imports are unused, remove only those
        const importPattern = new RegExp(`{\\s*([^}]*)\\s*}\\s+from\\s+['"]${imp.module}['"]`);
        const namedMatch = importPattern.exec(imp.line);
        
        if (namedMatch) {
          const importsList = namedMatch[1].split(',').map(i => i.trim());
          const newImportsList = importsList.filter(importItem => {
            const importName = importItem.split(' as ')[0].trim();
            return !unusedInThisImport.includes(importName);
          });
          
          const newImportLine = imp.line.replace(
            `{ ${namedMatch[1]} }`,
            `{ ${newImportsList.join(', ')} }`
          );
          
          newContent = newContent.replace(imp.line, newImportLine);
          modified = true;
        }
      }
    }
    
    if (modified) {
      await fs.writeFile(fullPath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔍 Scanning for TypeScript files with unused imports...');
  
  let totalFilesProcessed = 0;
  let totalFilesModified = 0;
  
  for (const directory of DIRECTORIES) {
    try {
      const files = await findTsFiles(directory);
      console.log(`  Found ${files.length} TypeScript files in ${directory}`);
      
      for (const file of files) {
        const wasModified = await processFile(file);
        totalFilesProcessed++;
        
        if (wasModified) {
          console.log(`    ✓ Fixed unused imports in ${file}`);
          totalFilesModified++;
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${directory}:`, error);
    }
  }
  
  console.log('\n✅ Finished scanning and fixing unused imports');
  console.log(`   Processed ${totalFilesProcessed} files, modified ${totalFilesModified} files.`);
  
  console.log('\nFor a more thorough cleanup, consider running:');
  console.log('  npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unused-imports');
  console.log('  npx eslint --fix "src/**/*.{ts,tsx}"');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});