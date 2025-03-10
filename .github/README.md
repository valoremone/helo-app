# HELO Admin Control Panel

![CI/CD](https://github.com/organization/helo-admin/workflows/CI%2FCD/badge.svg)
![License](https://img.shields.io/badge/license-Proprietary-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.1-green.svg)

![HELO Logo](../admin/public/HELO-full-logo-dark.svg)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/organization/helo-admin.git

# Navigate to the admin directory
cd helo-admin/admin

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠 Development

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release preparation

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Example:
```bash
git commit -m "feat: add user authentication system"
```

### Pull Request Process

1. Create a new branch from `develop`
2. Make your changes
3. Update documentation if needed
4. Create a PR to `develop`
5. Ensure CI passes
6. Get code review approval
7. Merge using squash and merge

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 📦 Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

Environment variables should be set in `.env` file:

```env
VITE_API_URL=https://api.example.com
VITE_APP_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

Copyright © 2025 HELO Aviation Services. All rights reserved.

## 🔍 Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [CHANGELOG.md](../CHANGELOG.md).

## 👥 Team

- Project Manager: [Name]
- Lead Developer: [Name]
- UI/UX Designer: [Name]

## 📞 Support

For support, email [support@flyhelo.one](mailto:support@flyhelo.one) 