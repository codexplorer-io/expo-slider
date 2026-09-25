# `@codexporer.io/expo-slider`

A smooth, touch-responsive range and single-value slider component for React Native applications built with `PanResponder`.

## Installation & Peer Dependencies

```bash
yarn add @codexporer.io/expo-slider
```

Peer dependencies:
- `react` (`*`)
- `react-native` (`*`)

## Quick Start

### Single-Value Slider

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider } from '@codexporer.io/expo-slider';

export function VolumeSlider() {
  const [volume, setVolume] = useState(0.5);

  return (
    <View style={styles.container}>
      <Text>Volume: {Math.round(volume * 100)}%</Text>
      <Slider
        min={0}
        max={1}
        step={0.01}
        low={volume}
        disableRange={true}
        sliderRailSelectedColor="#01579B"
        sliderRailUnselectedColor="#e0e0e0"
        onValueChanged={(low) => setVolume(low)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
});
```

### Range Slider (Dual Thumbs)

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Slider } from '@codexporer.io/expo-slider';

export function FrequencyFilter() {
  const [range, setRange] = useState({ low: 20, high: 20000 });

  return (
    <View style={{ padding: 20 }}>
      <Text>Frequency Range: {range.low}Hz - {range.high}Hz</Text>
      <Slider
        min={20}
        max={20000}
        step={10}
        low={range.low}
        high={range.high}
        disableRange={false}
        sliderRailSelectedColor="#38bdf8"
        sliderRailUnselectedColor="#333"
        onValueChanged={(low, high) => setRange({ low, high })}
      />
    </View>
  );
}
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `min` | `number` | `0` | Minimum slider value |
| `max` | `number` | `1` | Maximum slider value |
| `step` | `number` | `0.01` | Value increment interval |
| `low` | `number` | `0` | Lower thumb value (or single value when `disableRange` is true) |
| `high` | `number` | — | Upper thumb value (in range mode) |
| `disableRange` | `boolean` | `false` | When true, renders single thumb slider |
| `onValueChanged` | `(low: number, high: number, fromUser: boolean) => void` | — | Callback invoked when value changes |
| `sliderRailSelectedColor` | `string` | `'#4499ff'` | Color of the active highlighted track |
| `sliderRailUnselectedColor` | `string` | `'#e0e0e0'` | Color of the inactive background track |
| `renderThumb` | `(name: 'low' \| 'high') => ReactNode` | — | Custom render function for thumb handle |
| `renderRail` | `() => ReactNode` | — | Custom render function for background rail |
| `renderRailSelected` | `() => ReactNode` | — | Custom render function for active rail |
| `style` | `StyleProp<ViewStyle>` | — | Container style |

## License

MIT