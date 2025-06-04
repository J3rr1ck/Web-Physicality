// scripts/generate-ubuntu-snapshot.js
const fs = require('fs').promises;
const path = require('path');
const { snapshot } = require('@webcontainer/snapshot');

const SOURCE_DIR_NAME = 'assets/ubuntu-fs';
const OUTPUT_FILE_NAME = 'public/ubuntu.bin';

const currentDir = __dirname; // Gets the directory where the script is located (scripts/)
const projectRoot = path.resolve(currentDir, '..'); // Navigate up to the project root

const sourcePath = path.join(projectRoot, SOURCE_DIR_NAME);
const outputPath = path.join(projectRoot, OUTPUT_FILE_NAME);

async function generateSnapshot() {
  console.log(`Attempting to generate snapshot from: ${sourcePath}`);
  console.log(`Output will be written to: ${outputPath}`);

  try {
    // Ensure the source directory exists
    await fs.access(sourcePath);
    console.log(`Source directory ${sourcePath} found.`);
  } catch (error) {
    console.error(`Error: Source directory ${sourcePath} not found or not accessible.`);
    console.error('Please ensure you have prepared the Ubuntu filesystem at this location.');
    console.error('Refer to step 3 of the plan for guidance on creating this directory.');
    process.exit(1);
  }

  try {
    // Ensure the output directory (public/) exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    console.log(`Ensured output directory ${outputDir} exists.`);

    const binarySnapshot = await snapshot(sourcePath);
    console.log('Snapshot generation successful.');

    await fs.writeFile(outputPath, binarySnapshot);
    console.log(`Snapshot successfully written to ${outputPath}`);
    console.log('You can now proceed with modifying terminal-app.tsx.');

  } catch (error) {
    console.error('Error during snapshot generation or writing:', error);
    process.exit(1);
  }
}

generateSnapshot();
