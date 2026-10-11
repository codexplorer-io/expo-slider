# AGENTS.md — `@codexporer.io/expo-slider`

## Package Overview
Custom gesture-based slider control with optional floating value bubble, step increments, and theme integration.

## Key Exports
- `Slider`: Interactive slider component.
- `SliderProps`: Props interface.

## Critical Guidelines for AI Agents
- Bind `value: number`, `onValueChange: (val: number) => void`, and optionally `onSlidingComplete: (val: number) => void`.
- When adjusting photo properties (e.g. brightness, contrast, speed), set `onSlidingComplete` to commit expensive operations and use `onValueChange` for real-time preview.
- To display value popups above the thumb while dragging, set `showFloatingIndicator={true}` and supply `floatingIndicatorFormat={(val) => ...}`.
- Theme defaults: active track uses `theme.primary`, inactive track uses `theme.surfaceSecondary`, thumb uses `theme.primary`.
