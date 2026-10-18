# Skrew Calculator — Skill Library

Documentation for the Skrew card-game score tracker, written as agent-readable
skills. Each subfolder contains a `SKILL.md` with YAML frontmatter (`name`,
`description` stating when to use it) followed by concrete instructions, file
paths, and code patterns.

## Skills

| Skill | Use when |
| --- | --- |
| [skrew-app-overview](./skrew-app-overview/SKILL.md) | You need the big picture: stack, structure, app flow, where things live. |
| [skrew-game-logic](./skrew-game-logic/SKILL.md) | Changing rules, scoring, turns, kings, ranking, or game modes. |
| [skrew-ui-screens](./skrew-ui-screens/SKILL.md) | Working on screens, components, the sticky turn bar, or layouts. |
| [skrew-persistence](./skrew-persistence/SKILL.md) | Touching localStorage, session schema, or adding a backend. |
| [skrew-i18n-rtl](./skrew-i18n-rtl/SKILL.md) | Adding/editing strings or anything LTR/RTL related. |
| [skrew-theming](./skrew-theming/SKILL.md) | Working on light/dark themes or adding dark styles. |
| [skrew-avatars](./skrew-avatars/SKILL.md) | Working on player avatars (BigHeads, seeds, presets, picker). |
| [skrew-dev-workflow](./skrew-dev-workflow/SKILL.md) | Running builds/lint, or verifying changes before handing off. |

## Ground rules (apply to all skills)

- Package manager is Yarn 1 (`yarn.lock`); dev server runs on port 4000.
- Always finish with `yarn lint && yarn build`.
- Keep translations out of components; keep game rules out of UI components.
- No comments in code unless they explain a non-obvious workaround.
