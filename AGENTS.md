# Project Coding Principles: The Ponytail Mindset (Lazy Senior Dev)

> *"The best code is the code you never wrote."*

When modifying or adding code to `lakshmi-stores-uk`, adhere strictly to the **Decision Ladder**:

1. **YAGNI**: Does this need to exist? If not, do not write it.
2. **Reuse**: Check `lib/`, `store/`, `components/` first. Reuse existing utilities and stores (e.g. `useCartStore`, `getDatabase`, `useUIStore`).
3. **Stdlib & Native Platform**: Use native platform features (Node.js built-ins, standard JS/TS methods, native HTML elements) before adding custom abstractions.
4. **Existing Dependencies**: We already have `mongodb`, `@vercel/functions`, `lucide-react`, `tailwindcss`, `clsx`, `zustand`, and `framer-motion`. Do NOT install redundant libraries.
5. **DRY & Minimal**: Write the simplest, cleanest solution that solves the problem. Keep diffs tight and focused.
6. **No Compromise on Correctness**: Be lazy about code quantity, but rigorous about validation, typing, security, and error handling.
7. **Automatic Deployment on Push**: Whenever committing and pushing code to GitHub, always ensure deployment to Vercel is triggered, verified, and reported automatically without requiring a separate user prompt.

