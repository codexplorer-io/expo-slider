---
name: expo-slider
description: Instructions and guidelines for using @codexporer.io/expo-slider (Expo Slider) in React Native and Expo applications.
---

# `@codexporer.io/expo-slider` Skill

## Overview
`@codexporer.io/expo-slider` is a touch-responsive slider and range slider component built with React Native's `PanResponder`. It supports both single-value sliders and dual-thumb range selection with configurable step increments, custom renderers, and custom rail colors.

---

## When to Use
- Selecting a single numeric value (e.g. brightness, volume, playback speed, radius).
- Selecting a min/max range interval (e.g. audio frequency cutoff, price range, video trim window).

---

## Usage Examples

### 1. Single-Value Slider
`disableRange` defaults to `true`. Pass `low={value}` and handle changes with `onValueChanged={(low) => ...}`.

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Slider } from '@codexporer.io/expo-slider';

export function VolumeSlider() {
  const [volume, setVolume] = useState(0.5);

  return (
    <View style={{ padding: 16 }}>
      <Text>Volume: {Math.round(volume * 100)}%</Text>
      <Slider
        min={0}
        max={1}
        step={0.01}
        low={volume}
        disableRange={true}
        sliderRailSelectedColor="#01579B"
        sliderRailUnselectedColor="rgba(255, 255, 255, 0.2)"
        onValueChanged={(low) => setVolume(low)}
      />
    </View>
  );
}
```

### 2. Dual-Thumb Range Slider
Set `disableRange={false}` and provide both `low` and `high`.

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Slider } from '@codexporer.io/expo-slider';

export function FrequencyFilter() {
  const [range, setRange] = useState({ low: 100, high: 5000 });

  return (
    <View style={{ padding: 16 }}>
      <Text>Range: {range.low}Hz - {range.high}Hz</Text>
      <Slider
        min={20}
        max={20000}
        step={10}
        low={range.low}
        high={range.high}
        disableRange={false}
        sliderRailSelectedColor="#38bdf8"
        sliderRailUnselectedColor="#333333"
        onValueChanged={(low, high) => setRange({ low, high })}
      />
    </View>
  );
}
```

---

## API Reference

### `<Slider />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `min` | `number` | `0` | Minimum lower bound value |
| `max` | `number` | `1` | Maximum upper bound value |
| `step` | `number` | `0.01` | Value increment interval |
| `low` | `number` | `0` | Value for lower thumb (or single value when `disableRange` is true) |
| `high` | `number` | `max` | Value for upper thumb (used in dual-thumb range mode) |
| `disableRange` | `boolean` | `true` | When `true`, single thumb mode; when `false`, dual-thumb range mode |
| `onValueChanged` | `(low: number, high: number, fromUser: boolean) => void` | — | Callback fired when slider value updates |
| `sliderRailSelectedColor` | `string` | `'#01579B'` | Color of the selected/active track segment |
| `sliderRailUnselectedColor` | `string` | `'rgba(255, 255, 255, 0.2)'` | Color of the unselected/inactive track rail |
| `renderThumb` | `(name: 'low' \| 'high') => React.ReactNode` | — | Optional custom render function for thumb handle |
| `renderRail` | `() => React.ReactNode` | — | Optional custom render function for inactive track rail |
| `renderRailSelected` | `() => React.ReactNode` | — | Optional custom render function for active track rail |
| `style` | `StyleProp<ViewStyle>` | — | Optional style applied to outer container |

---

## Critical Rules & Guidelines
1. **Accurate Prop Names**:
   - The value callback is `onValueChanged: (low, high, fromUser) => void` (NOT `onValueChange` or `onSlidingComplete`).
   - Value props are `low` and `high` (NOT `value`, `minimumValue`, or `maximumValue`).
2. **Range vs Single Mode**:
   - `disableRange` defaults to `true` (single slider). To enable a range slider with two thumbs, explicitly pass `disableRange={false}`.
3. **Throttling Updates**:
   - `onValueChanged` fires continuously during drag gestures. If triggering heavy operations (image processing, video rendering, network requests), debounce or throttle state updates in the parent component.
4. **Theming**:
   - Pass theme colors from `useAppTheme()` to `sliderRailSelectedColor` and `sliderRailUnselectedColor`.
