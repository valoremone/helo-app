#!/usr/bin/env node
/**
 * Script to clean up the project by removing unused components
 * and optimizing dependencies.
 * 
 * Run with: node scripts/cleanup.mjs [--dry-run] [--components] [--dependencies]
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  cleanComponents: args.includes('--components') || !args.includes('--dependencies'),
  cleanDependencies: args.includes('--dependencies') || !args.includes('--components')
};

// Folder to back up files before removing
const BACKUP_DIR = 'backups/cleanup-' + new Date().toISOString().replace(/[:.]/g, '-');

// List of shadcn components that might be safely removed if unused
const UNUSED_SHADCN_COMPONENTS = [
  'src/components/ui/accordion.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/aspect-ratio.tsx',
  'src/components/ui/breadcrumb.tsx',
  'src/components/ui/command.tsx',
  'src/components/ui/context-menu.tsx',
  'src/components/ui/drawer.tsx',
  'src/components/ui/hover-card.tsx',
  'src/components/ui/input-otp.tsx',
  'src/components/ui/menubar.tsx',
  'src/components/ui/pagination.tsx',
  'src/components/ui/resizable.tsx',
  'src/components/ui/slider.tsx',
  'src/components/ui/toggle-group.tsx'
];

// Dependencies that are likely not needed
const POTENTIAL_UNUSED_DEPENDENCIES = [
  'cmdk',  // Used by command component
  'input-otp',  // Used by input-otp component 
  'embla-carousel-react',  // Used by carousel component
  'react-resizable-panels',  // Used by resizable component
  'vaul'  // Used by drawer component
];

async function backupFile(filePath) {
  if (!existsSync(filePath)) {
    console.log(`  ⚠️ ${filePath} doesn't exist, skipping backup`);
    return;
  }
  
  const backupPath = path.join(BACKUP_DIR, filePath);
  const backupDir = path.dirname(backupPath);
  
  // Ensure backup directory exists
  await mkdir(backupDir, { recursive: true });
  
  // Copy file to backup
  const content = await readFile(filePath, 'utf8');
  await writeFile(backupPath, content);
  
  console.log(`  📦 Backed up: ${filePath}`);
}

async function cleanupUnusedComponents() {
  console.log('🧹 Cleaning up unused UI components...');
  
  if (options.dryRun) {
    console.log('  ℹ️ DRY RUN MODE: No files will be removed');
  }
  
  for (const component of UNUSED_SHADCN_COMPONENTS) {
    try {
      // Check if component exists
      if (!existsSync(component)) {
        console.log(`  ⚠️ ${component} doesn't exist, skipping`);
        continue;
      }
      
      // Check if component is imported anywhere
      const componentName = path.basename(component, path.extname(component));
      try {
        const { stdout } = await execAsync(`grep -r "from.*${componentName}" --include="*.tsx" --include="*.ts" src/ | grep -v "${component}"`);
        if (stdout.trim()) {
          console.log(`  ✅ ${component} is used elsewhere, keeping`);
          continue;
        }
      } catch (error) {
        // grep returns non-zero when no matches found, which is what we want
      }
      
      // Component appears unused, back it up and remove
      console.log(`  🗑️ ${component} appears unused`);
      
      if (!options.dryRun) {
        await backupFile(component);
        
        // Create a .bak file instead of deleting
        const bakPath = `${component}.bak`;
        await execAsync(`mv "${component}" "${bakPath}"`);
        console.log(`      Moved to ${bakPath}`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${component}:`, error.message);
    }
  }
}

async function optimizeDependencies() {
  console.log('\n📦 Optimizing dependencies...');
  
  if (options.dryRun) {
    console.log('  ℹ️ DRY RUN MODE: package.json will not be modified');
  }
  
  try {
    // Read package.json
    const packageJsonPath = 'package.json';
    const packageJsonContent = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Back up package.json
    if (!options.dryRun) {
      await backupFile(packageJsonPath);
    }
    
    // Check each potentially unused dependency
    const dependenciesToRemove = [];
    
    for (const dep of POTENTIAL_UNUSED_DEPENDENCIES) {
      if (packageJson.dependencies[dep]) {
        try {
          // Check if it's used in any file
          const { stdout } = await execAsync(`grep -r "from.*${dep}" --include="*.tsx" --include="*.ts" src/`);
          
          if (!stdout.trim()) {
            dependenciesToRemove.push(dep);
            console.log(`  🗑️ ${dep} appears unused and can be removed`);
          } else {
            console.log(`  ✅ ${dep} is used in the code, keeping`);
          }
        } catch (error) {
          // grep returns non-zero when no matches found
          dependenciesToRemove.push(dep);
          console.log(`  🗑️ ${dep} appears unused and can be removed`);
        }
      }
    }
    
    // Remove unused dependencies
    if (dependenciesToRemove.length > 0 && !options.dryRun) {
      // Remove from package.json
      for (const dep of dependenciesToRemove) {
        delete packageJson.dependencies[dep];
      }
      
      // Write updated package.json
      await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`  ✅ Updated package.json, removed ${dependenciesToRemove.length} dependencies`);
      
      // Suggest running npm install
      console.log('\n  ℹ️ To update node_modules, run: npm install');
    } else if (dependenciesToRemove.length > 0) {
      console.log(`\n  ℹ️ Would remove these dependencies: ${dependenciesToRemove.join(', ')}`);
    } else {
      console.log('  ✅ No unused dependencies found from the target list');
    }
    
    // Add React 19 compatibility to overrides if not already present
    if (!packageJson.overrides || !packageJson.overrides['react-is']) {
      console.log('\n  ⚠️ React 19 compatibility override not found');
      console.log('  ℹ️ Adding react-is override for React 19 compatibility');
      
      if (!options.dryRun) {
        if (!packageJson.overrides) {
          packageJson.overrides = {};
        }
        
        packageJson.overrides['react-is'] = '^19.0.0';
        
        // Write updated package.json
        await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log('  ✅ Added React 19 compatibility override');
      }
    } else {
      console.log('\n  ✅ React 19 compatibility override already configured');
    }
    
  } catch (error) {
    console.error('  ❌ Error optimizing dependencies:', error.message);
  }
}

async function main() {
  console.log('🧰 Project Cleanup Tool');
  console.log('---------------------');
  console.log(`Mode: ${options.dryRun ? 'Dry Run (no changes will be made)' : 'Live Run'}`);
  console.log(`Operations: ${options.cleanComponents ? 'Clean Components' : ''} ${options.cleanDependencies ? 'Clean Dependencies' : ''}`);
  console.log('---------------------\n');
  
  // Create backup directory
  if (!options.dryRun) {
    await mkdir(BACKUP_DIR, { recursive: true });
    console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
  }
  
  // Clean up unused components
  if (options.cleanComponents) {
    await cleanupUnusedComponents();
  }
  
  // Optimize dependencies
  if (options.cleanDependencies) {
    await optimizeDependencies();
  }
  
  console.log('\n✨ Cleanup complete!');
  if (options.dryRun) {
    console.log('\n📝 This was a dry run. To perform actual changes, run: node scripts/cleanup.mjs');
  } else {
    console.log(`\n💾 Backups saved to: ${BACKUP_DIR}`);
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 