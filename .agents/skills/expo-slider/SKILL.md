---
name: expo-slider
description: Instructions and guidelines for using @codexporer.io/expo-slider (Expo Slider) in React Native and Expo applications.
---

# `@codexporer.io/expo-slider` Skill

## Overview
`@codexporer.io/expo-slider` is a touch-responsive slider bar supporting floating value bubbles, discrete steps, min/max ranges, and automatic theme adaptation via `@codexporer.io/expo-app-theme`.

---

## When to Use
- Fine-tuning editor adjustments (brightness, contrast, saturation, sharpness).
- Setting numeric values such as video clip duration, margin sizes, corner radii, or audio volume.

---

## Usage Example

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Slider } from '@codexporer.io/expo-slider';

export function BrightnessControl() {
  const [brightness, setBrightness] = useState(0);

  return (
    <View style={{ padding: 16 }}>
      <Text>Brightness: {Math.round(brightness * 100)}%</Text>
      <Slider
        value={brightness}
        minimumValue={-1}
        maximumValue={1}
        step={0.05}
        showFloatingIndicator={true}
        floatingIndicatorFormat={(v) => `${Math.round(v * 100)}%`}
        onValueChange={setBrightness}
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
| `value` | `number` | `0` | Controlled numeric value |
| `minimumValue` | `number` | `0` | Lower bound |
| `maximumValue` | `number` | `1` | Upper bound |
| `step` | `number` | `0` | Granular step increment (0 for continuous) |
| `onValueChange` | `(value: number) => void` | — | Real-time continuous change callback |
| `onSlidingStart` | `() => void` | — | Fired when drag gesture begins |
| `onSlidingComplete` | `(value: number) => void` | — | Fired when user lifts finger |
| `showFloatingIndicator` | `boolean` | `false` | Shows floating value bubble above thumb while dragging |
| `floatingIndicatorFormat` | `(val: number) => string` | — | Formatter function for the bubble text |
| `trackHeight` | `number` | `4` | Thickness of the slider track line |
| `thumbSize` | `number` | `20` | Diameter of the draggable thumb knob |
| `disabled` | `boolean` | `false` | Disables interaction |
| `style` | `StyleProp<ViewStyle>` | — | Container style override |

---

## Critical Rules & Guidelines
1. **Debounce / Defer Expensive Computations**: Use `onSlidingComplete` for heavy operations (like rendering full-res image filters) and `onValueChange` for lightweight UI previews.
2. **Bounds**: Always ensure `maximumValue > minimumValue`.
