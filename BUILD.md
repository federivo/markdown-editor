# Building and Distributing Markdown Reader

This guide explains how to build distribution packages for all major platforms.

## Prerequisites

- Node.js 16.0 or higher
- npm package manager

## Build Commands

### Local Development Build
```bash
npm run build
```

### Distribution Packages

#### Build for Current Platform
```bash
npm run dist
```

#### Build for Specific Platforms
```bash
# macOS only
npm run dist:mac

# Windows only  
npm run dist:win

# Linux only
npm run dist:linux

# All platforms (requires platform-specific dependencies)
npm run dist:all
```

## Platform-Specific Outputs

### macOS
- **DMG**: `build/Markdown Reader-1.0.0.dmg` - Drag-and-drop installer
- **ZIP**: `build/Markdown Reader-1.0.0-mac.zip` - Portable app bundle
- **Architectures**: Intel (x64) and Apple Silicon (arm64)

### Windows
- **NSIS Installer**: `build/Markdown Reader Setup 1.0.0.exe` - Standard Windows installer
- **ZIP**: `build/Markdown Reader-1.0.0-win.zip` - Portable executable
- **Architectures**: 64-bit (x64) and 32-bit (ia32)

### Linux
- **AppImage**: `build/Markdown Reader-1.0.0.AppImage` - Universal Linux executable
- **DEB**: `build/markdown-reader_1.0.0_amd64.deb` - Debian/Ubuntu package
- **TAR.GZ**: `build/Markdown Reader-1.0.0.tar.gz` - Archive for manual installation

## GitHub Releases Setup

### 1. Manual Release Process

1. **Build locally:**
   ```bash
   npm run dist:all
   ```

2. **Create GitHub release:**
   - Go to your GitHub repository
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0` (increment version)
   - Title: `Markdown Reader v1.0.0`
   - Upload files from `build/` directory

3. **Recommended files to upload:**
   - `Markdown Reader-1.0.0.dmg` (macOS)
   - `Markdown Reader-1.0.0-mac.zip` (macOS portable)
   - `Markdown Reader Setup 1.0.0.exe` (Windows installer)
   - `Markdown Reader-1.0.0-win.zip` (Windows portable)
   - `Markdown Reader-1.0.0.AppImage` (Linux)
   - `markdown-reader_1.0.0_amd64.deb` (Linux DEB)

### 2. Automated Release (GitHub Actions)

The included GitHub Actions workflow (`.github/workflows/release.yml`) automatically builds and releases when you push a version tag:

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

This will:
- Build for all platforms simultaneously
- Create a GitHub release
- Upload all distribution files automatically

## File Naming Convention

- **Version**: Automatically read from `package.json`
- **App Name**: "Markdown Reader" (from `package.json` productName)
- **Platforms**: mac, win, linux
- **Architectures**: x64, arm64 (macOS), ia32 (Windows)

## Distribution File Sizes (Approximate)

- **macOS DMG**: ~150-200 MB
- **Windows NSIS**: ~120-150 MB  
- **Linux AppImage**: ~130-160 MB
- **Portable ZIP/TAR**: ~100-130 MB

## Code Signing (Optional)

For production releases, consider code signing:

### macOS
- Requires Apple Developer account
- Add certificates to GitHub Secrets: `mac_certs`, `mac_certs_password`

### Windows
- Requires code signing certificate
- Add to GitHub Secrets: `win_certs`, `win_certs_password`

## Troubleshooting

### Common Build Issues

1. **"Cannot resolve dependency"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Platform-specific builds fail**
   - Install platform dependencies
   - Use GitHub Actions for cross-platform builds

3. **Large bundle size**
   - Check `files` array in package.json build config
   - Ensure `dist/` contains only necessary files

### Build Directory Structure
```
build/
├── mac/
│   ├── Markdown Reader.app
│   └── Markdown Reader-1.0.0.dmg
├── win-unpacked/
│   └── Markdown Reader.exe
└── linux-unpacked/
    └── markdown-reader
```

## Next Steps

1. Update version in `package.json`
2. Update GitHub repository settings in `package.json` publish config
3. Run your first build: `npm run dist`
4. Create your first GitHub release!