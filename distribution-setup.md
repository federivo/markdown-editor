# Distribution Setup Guide

This document explains how to create distribution packages for all major platforms and set up GitHub releases for easy user downloads.

## 🚀 **Distribution Setup Complete!**

Your Markdown Reader app is now configured for professional multi-platform distribution with automated GitHub releases.

### **1. Enhanced Build Configuration**

The app is configured to build for:
- **macOS**: Intel (x64) + Apple Silicon (arm64) architectures
- **Windows**: 64-bit (x64) + 32-bit (ia32) architectures  
- **Linux**: 64-bit (x64) with multiple package formats
- **GitHub publishing**: Ready for automated releases

### **2. Available Build Commands**

```bash
# Build for current platform only
npm run dist

# Build for specific platforms
npm run dist:mac     # macOS DMG + ZIP
npm run dist:win     # Windows installer + portable
npm run dist:linux   # Linux AppImage + DEB + TAR.GZ

# Build everything (requires all platform dependencies)
npm run dist:all

# Release to GitHub (with version tag)
npm run release
```

### **3. What Users Will Get**

#### 📱 **macOS Users:**
- `Markdown Reader-1.0.0.dmg` - Standard drag-and-drop installer (~150-200 MB)
- `Markdown Reader-1.0.0-mac.zip` - Portable app bundle (~100-130 MB)
- **Compatibility**: Works on both Intel and Apple Silicon Macs

#### 🖥️ **Windows Users:**
- `Markdown Reader Setup 1.0.0.exe` - Standard Windows installer (~120-150 MB)
- `Markdown Reader-1.0.0-win.zip` - Portable executable (~100-130 MB)
- **Compatibility**: Supports both 64-bit and 32-bit systems

#### 🐧 **Linux Users:**
- `Markdown Reader-1.0.0.AppImage` - Universal Linux executable (~130-160 MB)
- `markdown-reader_1.0.0_amd64.deb` - Debian/Ubuntu package
- `Markdown Reader-1.0.0.tar.gz` - Archive for manual installation
- **No installation needed**: AppImage runs directly

### **4. GitHub Release Process**

#### **Option A - Manual Release:**
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
   - `Markdown Reader-1.0.0.dmg` (macOS installer)
   - `Markdown Reader-1.0.0-mac.zip` (macOS portable)
   - `Markdown Reader Setup 1.0.0.exe` (Windows installer)
   - `Markdown Reader-1.0.0-win.zip` (Windows portable)
   - `Markdown Reader-1.0.0.AppImage` (Linux universal)
   - `markdown-reader_1.0.0_amd64.deb` (Linux DEB package)

#### **Option B - Automated Release:**
1. **Push version tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions automatically:**
   - Builds for all platforms simultaneously
   - Creates a GitHub release
   - Uploads all distribution files

### **5. Configuration Details**

#### **Build Targets:**
- **macOS**: DMG installer + ZIP portable (x64, arm64)
- **Windows**: NSIS installer + ZIP portable (x64, ia32)
- **Linux**: AppImage + DEB package + TAR.GZ archive (x64)

#### **File Structure After Build:**
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

### **6. Setup Requirements**

#### **Before First Build:**
1. **Update GitHub configuration:**
   - Edit `package.json` → `build.publish.owner` with your GitHub username
   - Edit `package.json` → `build.publish.repo` with your repository name

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Test build for current platform:**
   ```bash
   npm run dist
   ```

#### **For Automated Releases:**
- GitHub Actions workflow is already configured (`.github/workflows/release.yml`)
- No additional setup required for basic releases
- Optional: Add code signing certificates for production releases

### **7. Code Signing (Optional)**

For production releases, consider code signing to avoid security warnings:

#### **macOS:**
- Requires Apple Developer account ($99/year)
- Add certificates to GitHub Secrets: `mac_certs`, `mac_certs_password`

#### **Windows:**
- Requires code signing certificate
- Add to GitHub Secrets: `win_certs`, `win_certs_password`

### **8. Troubleshooting**

#### **Common Build Issues:**
1. **"Cannot resolve dependency"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Platform-specific builds fail**
   - Use GitHub Actions for reliable cross-platform builds
   - Ensure all dependencies are installed

3. **Large bundle size**
   - Check `files` array in package.json build config
   - Verify `dist/` contains only necessary files

### **9. Next Steps**

1. **Update configuration:**
   - Set your GitHub username in `package.json`
   - Increment version number for releases

2. **Create first release:**
   ```bash
   # Test local build
   npm run dist
   
   # Create and push version tag for automated release
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Share with users:**
   - Users can download directly from GitHub Releases page
   - No technical knowledge required for installation
   - Works offline after download

## 📋 **Summary**

Your Markdown Reader app now supports professional distribution across all major platforms with:
- ✅ Multi-platform builds (macOS, Windows, Linux)
- ✅ Multiple architecture support
- ✅ Automated GitHub releases
- ✅ User-friendly installers and portable versions
- ✅ Professional app icons and metadata

Users can simply visit your GitHub releases page and download the appropriate file for their operating system!