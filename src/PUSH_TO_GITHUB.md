# 🚀 Push TrustEye to GitHub

Follow these steps to push your TrustEye project to GitHub repository: `https://github.com/barmatelakshya/trytusteye`

## ⚠️ Before You Start

**IMPORTANT:** Delete the LICENSE directory (it contains code files and should not be in the root):

```bash
rm -rf LICENSE/
```

You already have a proper `LICENSE.md` file in the root.

## 📤 Step-by-Step Instructions

### 1. Initialize Git Repository
```bash
git init
```

### 2. Add All Files
```bash
git add .
```

### 3. Check Status (Optional but Recommended)
```bash
git status
```
This will show you all files that will be committed.

### 4. Create Your First Commit
```bash
git commit -m "Initial commit: TrustEye AI threat detection platform

- Complete AI-powered threat scanner with real-time analysis
- Interactive dashboard with charts and statistics  
- Education hub with quizzes and case studies
- Dark/light theme with persistence
- Privacy-first design with local processing
- Responsive design for all devices"
```

### 5. Add Remote Repository
```bash
git remote add origin https://github.com/barmatelakshya/trytusteye.git
```

### 6. Verify Remote (Optional)
```bash
git remote -v
```

### 7. Push to GitHub

**If the repository is empty:**
```bash
git branch -M main
git push -u origin main
```

**If the repository already has content:**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 🔐 Authentication

If you encounter authentication issues:

### Option 1: Personal Access Token (Recommended)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Use the token as your password when prompted

### Option 2: SSH Key
1. Generate SSH key: `ssh-keygen -t ed25519 -C "lakshyabarmate@gmail.com"`
2. Add to GitHub: Settings → SSH and GPG keys
3. Use SSH URL: `git@github.com:barmatelakshya/trytusteye.git`

## ✅ Verify Success

After pushing, visit: https://github.com/barmatelakshya/trytusteye

You should see all your files!

## 📝 Future Updates

After the initial push, to update your repository:

```bash
git add .
git commit -m "Description of changes"
git push
```

## 🎯 Common Issues

### Issue: "failed to push some refs"
**Solution:** Pull first, then push:
```bash
git pull origin main --rebase
git push
```

### Issue: "Permission denied"
**Solution:** Check your authentication (token or SSH key)

### Issue: Large files
**Solution:** Check .gitignore is excluding node_modules and dist folders

---

Good luck! 🚀
