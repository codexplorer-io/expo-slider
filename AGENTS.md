# AGENTS.md — `@codexporer.io/expo-slider`

## Package Overview
Custom touch-responsive slider component built with React Native's `PanResponder`. Supports both single-value sliders and dual-thumb range sliders with configurable step increments, custom renderers, and color theming.

## Peer Dependencies
```json
{
  "react": "*",
  "react-native": "*"
}
```

## TypeScript Contracts (`src/index.tsx`)

```typescript
export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  low?: number;
  high?: number;
  disableRange?: boolean;
  onValueChanged?: (low: number, high: number, fromUser: boolean) => void;
  style?: StyleProp<ViewStyle>;
  sliderRailSelectedColor?: string;
  sliderRailUnselectedColor?: string;
  renderThumb?: (name: 'low' | 'high') => React.ReactNode;
  renderRail?: () => React.ReactNode;
  renderRailSelected?: () => React.ReactNode;
}
```

## Key Exports
- `Slider`: Interactive slider component.
- `SliderProps`: Props interface.

## Component Behavior & Defaults
- **Default Mode**: `disableRange` defaults to `true` (single thumb slider). Set `disableRange={false}` for dual-thumb range selection.
- **Value Binding**:
  - Single mode: pass `low={value}` and read `low` from `onValueChanged={(low) => ...}`.
  - Range mode: pass `low={minVal}` and `high={maxVal}` and read both from `onValueChanged={(low, high) => ...}`.
- **Defaults**:
  - `min = 0`, `max = 1`, `step = 0.01`, `low = 0`
  - `sliderRailSelectedColor = '#01579B'`
  - `sliderRailUnselectedColor = 'rgba(255, 255, 255, 0.2)'`
  - Default thumb: circular knob with diameter 28 (`borderRadius: 14`, white background with border).
  - Default rail: height 4 with `borderRadius: 2`.

## Critical Guidelines for AI Agents
- **Props Accuracy**: The callback prop is `onValueChanged` (`(low, high, fromUser) => void`), NOT `onValueChange` or `onChange`.
- **Value Props**: Value is passed via `low` (and `high` for ranges), NOT `value`.
- **Throttling Heavy Actions**: For computationally intensive operations (e.g. Skia image filtering or video re-encoding), throttle state updates using `lodash/throttle` in the parent screen.
- **Theming**: When using with `@codexporer.io/expo-app-theme`, supply `sliderRailSelectedColor={theme.primary}` and `sliderRailUnselectedColor={theme.surfaceSecondary}` or `theme.border`.

