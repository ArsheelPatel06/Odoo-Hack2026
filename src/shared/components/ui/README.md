# TransitOps Design System

Commit 10 foundation for the TransitOps operating UI.

## Principles

- Mission control, not generic admin template
- Interface disappears behind data
- Semantic tokens only (no hardcoded colors in components)
- Subtle motion (150–250ms)
- Stripe-like elevation and spacing

## Tokens

Defined in `src/app/globals.css` and mapped in `tailwind.config.ts`.

- Background: `page`, `surface`, `card`, `sidebar`, `popover`, `muted-surface`
- Text: `primary`, `secondary`, `muted`, `inverse` (+ legacy `text-text`)
- Border: `subtle`, `strong` (+ legacy `border-border`)
- States: `accent`, `success`, `warning`, `danger`, `info`
- Radius: `rounded-button` (12px), `rounded-input` (12px), `rounded-card` (20px), `rounded-dialog` (24px)

## Variants

CVA variants live in `src/shared/design-system/variants/`.

## Usage

```tsx
import { Button, Card, MetricCard, DataTable, AreaChartWrapper } from "@/shared/components/ui";
```

## Build order

1. Design System (this commit)
2. App Shell
3. Dashboard
4. Feature modules
