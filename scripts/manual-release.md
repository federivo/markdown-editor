# Manual Release Process

If GitHub Actions fails, follow this manual process to create releases:

## Step 1: Build Locally
```bash
# Build for your current platform
npm run dist

# Or if you can build for all platforms
npm run dist:all
```

## Step 2: Create GitHub Release
1. Go to your GitHub repository
2. Click "Releases" tab
3. Click "Create a new release"
4. Fill in:
   - **Tag**: `v1.0.1` (increment version)
   - **Title**: `Markdown Reader v1.0.1`
   - **Description**: List of changes/features

## Step 3: Upload Distribution Files
From the `build/` directory, upload these files:

### macOS
- `Markdown Reader-1.0.1.dmg`
- `Markdown Reader-1.0.1-mac.zip`

### Windows (if built)
- `Markdown Reader Setup 1.0.1.exe`
- `Markdown Reader-1.0.1-win.zip`

### Linux (if built)
- `Markdown Reader-1.0.1.AppImage`
- `markdown-reader_1.0.1_amd64.deb`

## Step 4: Publish Release
Click "Publish release" to make it available for download.

## Notes
- Build on each platform separately for best results
- macOS builds work on macOS
- Windows builds need Windows or proper Wine setup
- Linux builds work on Linux or can be cross-compiled