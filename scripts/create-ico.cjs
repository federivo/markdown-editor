#!/usr/bin/env node

// Simple script to create ICO file from PNG
// This is a workaround for macOS systems that don't have native ICO creation tools

const fs = require('fs');
const { execSync } = require('child_process');

console.log('Creating Windows ICO file from PNG...');

try {
  // Check if ImageMagick is available (common on some systems)
  try {
    execSync('which convert', { stdio: 'ignore' });
    console.log('Using ImageMagick convert...');
    execSync('convert assets/app-icon.png -define icon:auto-resize=256,128,96,64,48,32,16 assets/app-icon.ico');
    console.log('✅ ICO file created successfully with ImageMagick');
    process.exit(0);
  } catch (e) {
    // ImageMagick not available
  }

  // Fallback: Just copy the PNG as ICO (electron-builder will handle conversion)
  console.log('ImageMagick not found, using PNG file for Windows builds...');
  console.log('Note: electron-builder will automatically convert PNG to ICO during build');
  
  // Ensure we have a high-quality PNG
  if (fs.existsSync('assets/app-icon.png')) {
    console.log('✅ Using existing PNG file for Windows builds');
  } else {
    console.log('❌ app-icon.png not found in assets/ directory');
    process.exit(1);
  }
  
} catch (error) {
  console.error('Error creating ICO file:', error.message);
  console.log('💡 Solution: electron-builder will automatically convert PNG to ICO during build');
}