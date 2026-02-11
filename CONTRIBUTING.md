# Contributing Guidelines

Welcome! We're excited you want to help with the Conference Management Portal. To maintain a high-quality codebase, please follow these guidelines.

## 🌿 Branching Strategy
- `main`: Production-ready code.
- `develop`: Integration branch for features.
- `feature/*`: New features or enhancements.
- `bugfix/*`: Critical or minor bug fixes.

## 📝 Commit Messages
We follow a simplified version of conventional commits:
- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation updates.
- `style:` for UI/UX/CSS changes.
- `refactor:` for code restructuring.

Example: `feat: add email verification step to signup`

## 🎨 Coding Standards
### CSS & Styling
- Use **Tailwind CSS** for layout and spacing.
- Use **Vanilla CSS** in `index.css` for complex animations or global themes.
- Keep the "Premium" aesthetic: use soft shadows (`shadow-xl`), rounded corners (`rounded-2xl`), and subtle transitions.

### JavaScript/React
- Use functional components and hooks.
- Keep components small and reusable.
- Use `axios` for all API calls.

## 🧪 Testing
- Always verify your changes locally by running both `client` and `server`.
- Test new auth flows with a fresh database user if possible.

## 🚀 Pull Request Process
1. Rebase your branch with `develop` before submitting.
2. Ensure no `console.log` statements are left in production code (unless they are for server auditing).
3. Update the `README.md` if you add new features or environment variables.
