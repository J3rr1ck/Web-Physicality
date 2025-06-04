// scripts/generate-ubuntu-snapshot.js
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const https = require('https');
const { snapshot } = require('@webcontainer/snapshot');
const lzma = require('lzma-native');

// Download file helper
async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fsSync.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fsSync.unlink(dest, () => reject(err));
    });
  });
}

// Extract tar helper (handles .tar.xz by decompressing first)
async function extractTar(tarXzPath, destDir) {
  const tar = require('tar'); // Keep tar import

  try {
    await fs.mkdir(destDir, { recursive: true }); // Ensure destination directory exists

    if (tarXzPath.endsWith('.tar.xz')) {
      console.log(`Decompressing ${tarXzPath} using lzma-native...`);
      const compressedData = await fs.readFile(tarXzPath);
      const decompressedData = await lzma.decompress(compressedData);
      console.log('Decompression complete. Extracting .tar data...');

      const { Readable } = require('stream');
      const extractStream = tar.x({ cwd: destDir, strip: 1 });
      const readStream = new Readable();
      readStream.push(decompressedData);
      readStream.push(null);

      await new Promise((resolve, reject) => {
        readStream.pipe(extractStream)
          .on('finish', resolve)
          .on('error', reject);
      });

      console.log('Extraction from decompressed stream complete.');

    } else if (tarXzPath.endsWith('.tar')) { // Handle plain .tar files too
      console.log(`Extracting plain .tar file: ${tarXzPath}`);
      await tar.x({ file: tarXzPath, cwd: destDir, strip: 1 });
      console.log('Extraction complete.');
    } else {
      throw new Error('Unsupported archive format. Only .tar.xz and .tar are supported.');
    }

  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes("'tar'")) {
      console.error("The 'tar' package is required. Please install it with: pnpm install tar");
      process.exit(1);
    } else if (err.code === 'MODULE_NOT_FOUND' && err.message.includes("'lzma-native'")) {
      // This case should ideally not be hit if pnpm add was successful and node_modules are correctly loaded.
      console.error("The 'lzma-native' package is required. Please install it with: pnpm install lzma-native");
      process.exit(1);
    }
    // Add more specific error handling for lzma decompression if needed
    console.error(`Error during extraction: ${err.message}`);
    throw err; // Re-throw the error to be caught by the caller
  }
}


const currentDir = __dirname; // Gets the directory where the script is located (scripts/)
const projectRoot = path.resolve(currentDir, '..'); // Navigate up to the project root

const SOURCE_DIR_NAME = 'assets/ubuntu-fs';
const OUTPUT_FILE_NAME = 'public/ubuntu.bin';
const UBUNTU_IMAGE_URL = 'https://cloud-images.ubuntu.com/daily/server/releases/plucky/release-20250424/ubuntu-25.04-server-cloudimg-amd64-root.tar.xz';
const UBUNTU_IMAGE_LOCAL = path.join(projectRoot, 'tmp/ubuntu-25.04-server-cloudimg-amd64-root.tar.xz');

const sourcePath = path.join(projectRoot, SOURCE_DIR_NAME);
const outputPath = path.join(projectRoot, OUTPUT_FILE_NAME);

async function generateSnapshot() {
  console.log(`Preparing Ubuntu filesystem at: ${sourcePath}`);
  console.log(`Output will be written to: ${outputPath}`);

  // Step 1: Ensure source directory exists, otherwise download and extract
  let sourceReady = false;
  try {
    await fs.access(sourcePath);
    sourceReady = true;
    console.log(`Source directory ${sourcePath} found.`);
  } catch (error) {
    console.warn(`Source directory ${sourcePath} not found. Will attempt to download and extract Ubuntu image.`);
  }

  if (!sourceReady) {
    // Ensure tmp directory exists
    const tmpDir = path.join(projectRoot, 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });

    // Download if not already present
    try {
      await fs.access(UBUNTU_IMAGE_LOCAL);
      console.log(`Ubuntu image already downloaded at ${UBUNTU_IMAGE_LOCAL}`);
    } catch (e) {
      console.log(`Downloading Ubuntu image from ${UBUNTU_IMAGE_URL} ...`);
      await downloadFile(UBUNTU_IMAGE_URL, UBUNTU_IMAGE_LOCAL);
      console.log('Download complete.');
    }

    // Extract
    console.log('Extracting Ubuntu image...');
    try {
      await extractTar(UBUNTU_IMAGE_LOCAL, sourcePath);
      console.log('Extraction complete.'); // Only log if extractTar succeeds
    } catch (extractionError) {
      console.error(`Failed to extract Ubuntu image: ${extractionError.message}`);
      // Optionally, log the full error object for more details if needed in debugging
      // console.error(extractionError);
      process.exit(1); // Exit if extraction fails
    }
  }

  // Step 2: Generate snapshot as before
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
