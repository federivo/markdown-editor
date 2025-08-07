# Release Template

Use this template when creating GitHub releases to help users find the right downloads.

## Release Description Template

```markdown
## 📦 Download for Your Platform

**Choose ONE file based on your operating system:**

### 🍎 macOS Users
- **Download**: `Markdown-Reader-X.X.X.dmg`
- **Installation**: Double-click the DMG file and drag the app to Applications

### 🖥️ Windows Users  
- **Download**: `Markdown Reader Setup X.X.X.exe`
- **Installation**: Run the installer and follow the prompts

### 🐧 Linux Users
- **Download**: `Markdown-Reader-X.X.X.AppImage`
- **Installation**: Make executable (`chmod +x`) and run directly

---

## 🆕 What's New in This Release
[Add release notes here]
```

## Files to Expect (3 total)
1. `Markdown-Reader-X.X.X.dmg` (macOS)
2. `Markdown Reader Setup X.X.X.exe` (Windows)  
3. `Markdown-Reader-X.X.X.AppImage` (Linux)

## What Was Removed
- ZIP portable versions (simplified to installers only)
- Multiple architecture builds (universal/64-bit only)
- Blockmap and metadata files (disabled auto-updater files)
- TAR.GZ and DEB packages (simplified to AppImage only)