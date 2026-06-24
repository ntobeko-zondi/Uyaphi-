# SafeRide Africa - Restoring Previous State Guidelines

Should you ever wish to roll back, compare, or restore the platform features to a previous commit or state, you can easily do so using standard Git management tools or AI Studio session tools. 

---

## Method 1: Using standard Git Version Control (Recommended)
Because the codebase is a standard standard React repository, Git is the safest and most standard way to manage change restoration:

### 1. View recent changes and log
To inspect the history of changes made during sessions, run:
```bash
git log --oneline
```

### 2. Discard uncommitted changes (Immediate Restore)
If you want to immediately discard any local changes since your last commit:
```bash
git restore .
# or to clean any new files:
git clean -fd
```

### 3. Revert to a specific commit
To roll back the entire repository to a previous known-stable commit:
```bash
# 1. Locate the commit hash from git log
# 2. Revert to that commit state (soft or hard reset depending on need)
git reset --hard <commit-hash>
```

---

## Method 2: AI Studio History Tool
Inside the Google AI Studio builder workspace:
1. Navigate to the **History** tab in the sidebar of your builder panel.
2. Select any previous generation turn from the list to inspect the exact files modified.
3. You can copy-paste from previous turns, or prompt the coding agent: *"Please roll back all changes made to src/components/DriverSearch.tsx to its state in session checkpoint 1."*

---

## Method 3: Manual Backups
During major upgrades, copies of modified files are stored temporarily. You can also manually backup files before running major edits:
```bash
cp src/components/DriverSearch.tsx src/components/DriverSearch.bak.tsx
```
To restore:
```bash
cp src/components/DriverSearch.bak.tsx src/components/DriverSearch.tsx
```
