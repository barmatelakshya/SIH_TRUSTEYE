# Contributing to TrustEye

Thank you for your interest in contributing to TrustEye! We welcome contributions from the community.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/trusteye.git
   cd trusteye
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💡 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Your environment (browser, OS, etc.)

### Suggesting Enhancements

We love feature requests! Please create an issue with:
- A clear description of the enhancement
- Why this would be useful
- Any implementation ideas you have

### Pull Requests

1. **Update your fork** with the latest changes:
   ```bash
   git fetch origin
   git merge origin/main
   ```

2. **Make your changes** following our code style:
   - Use TypeScript for type safety
   - Follow existing component patterns
   - Use Tailwind CSS for styling (avoid custom CSS when possible)
   - Ensure accessibility (a11y) best practices

3. **Test your changes**:
   - Ensure the app builds without errors
   - Test in both light and dark modes
   - Check responsive design on different screen sizes
   - Test the scam detection algorithm with various inputs

4. **Commit your changes** with clear messages:
   ```bash
   git commit -m "feat: add new scam detection pattern"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub with:
   - A clear title and description
   - Reference to any related issues
   - Screenshots or GIFs for UI changes

## 🎨 Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling
- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Maintain responsive design principles
- Support dark mode

### File Organization
```
components/
  ├── ComponentName.tsx    # Main component logic
  └── ui/                  # Reusable UI components
utils/
  └── helperFunctions.ts   # Utility functions
```

## 🔒 Security

If you discover a security vulnerability, please email lakshyabarmate@gmail.com instead of creating a public issue.

## 📝 Documentation

- Update the README.md if you change functionality
- Add JSDoc comments for complex functions
- Update component props documentation

## ✅ Review Process

1. All PRs require at least one review
2. CI checks must pass
3. Code must follow style guidelines
4. No merge conflicts

## 🌟 Recognition

Contributors will be recognized in our README.md file!

## 📧 Questions?

Feel free to reach out at lakshyabarmate@gmail.com or open a discussion on GitHub.

Thank you for contributing to TrustEye! 🛡️
