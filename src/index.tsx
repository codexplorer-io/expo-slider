import React, { useRef, useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState,
    LayoutChangeEvent,
    StyleProp,
    ViewStyle
} from 'react-native';

const THUMB_RADIUS = 14;

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

type ActiveThumb = 'low' | 'high';

interface SliderPropsRef {
    safeMin: number;
    safeMax: number;
    step: number;
    disableRange: boolean;
    onValueChanged?: (low: number, high: number, fromUser: boolean) => void;
    safeLow: number;
    safeHigh: number;
}

const renderThumbDefault = () => (
    <View style={styles.defaultThumb} />
);

const createRenderRailDefault = ({ sliderRailUnselectedColor }) => () => (
    <View style={[styles.defaultRail, { backgroundColor: sliderRailUnselectedColor }]} />
);

const createRenderRailSelectedDefault = ({ sliderRailSelectedColor }) => () => (
    <View style={[styles.defaultRailSelected, { backgroundColor: sliderRailSelectedColor }]} />
);

export const Slider: React.FC<SliderProps> = ({
    min = 0,
    max = 1,
    step = 0.01,
    low = 0,
    high,
    disableRange = true,
    onValueChanged,
    style,
    sliderRailSelectedColor = '#01579B',
    sliderRailUnselectedColor = 'rgba(255, 255, 255, 0.2)',
    renderThumb = renderThumbDefault,
    renderRail = createRenderRailDefault({ sliderRailUnselectedColor }),
    renderRailSelected = createRenderRailSelectedDefault({ sliderRailSelectedColor }),
    ...props
}) => {
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerWidthRef = useRef<number>(0);
    containerWidthRef.current = containerWidth;

    const safeMin = Number.isFinite(min) ? min : 0;
    const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1;
    const initialHigh = high !== undefined && Number.isFinite(high) ? high : safeMax;

    const safeLow = Math.max(safeMin, Math.min(initialHigh, Number.isFinite(low) ? low : safeMin));
    const safeHigh = Math.max(safeLow, Math.min(safeMax, initialHigh));

    const propsRef = useRef<SliderPropsRef>({
        safeMin,
        safeMax,
        step,
        disableRange,
        onValueChanged,
        safeLow,
        safeHigh
    });

    propsRef.current = {
        safeMin,
        safeMax,
        step,
        disableRange,
        onValueChanged,
        safeLow,
        safeHigh
    };

    const availableWidth = Math.max(0, containerWidth - THUMB_RADIUS * 2);
    const range = safeMax - safeMin;

    const lowFraction = range > 0 ? (safeLow - safeMin) / range : 0;
    const lowThumbLeft = lowFraction * availableWidth;

    const highFraction = range > 0 ? (safeHigh - safeMin) / range : 1;
    const highThumbLeft = highFraction * availableWidth;

    const containerLeftRef = useRef<number>(0);
    const activeThumbRef = useRef<ActiveThumb>('low');

    const getValueFromX = (x: number): number => {
        const { safeMin: curMin, safeMax: curMax, step: curStep } = propsRef.current;
        const w = containerWidthRef.current - THUMB_RADIUS * 2;
        if (w <= 0) return curMin;
        const clampedX = Math.max(0, Math.min(w, x - THUMB_RADIUS));
        const fraction = clampedX / w;
        let rawVal = curMin + fraction * (curMax - curMin);
        if (curStep > 0) {
            rawVal = Math.round(rawVal / curStep) * curStep;
        }
        return Math.max(curMin, Math.min(curMax, rawVal));
    };

    const handleLayout = (e: LayoutChangeEvent): void => {
        const { width } = e.nativeEvent.layout;
        if (width > 0 && width !== containerWidth) {
            setContainerWidth(width);
        }
    };

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
            const {
                safeLow: curLow,
                safeHigh: curHigh,
                disableRange: isSingle,
                onValueChanged: changeCb
            } = propsRef.current;

            const pageX = evt.nativeEvent.pageX;
            const locationX = evt.nativeEvent.locationX;
            containerLeftRef.current = pageX - locationX;

            const val = getValueFromX(locationX);

            if (isSingle) {
                activeThumbRef.current = 'low';
                changeCb?.(val, curHigh, true);
            } else {
                const distLow = Math.abs(val - curLow);
                const distHigh = Math.abs(val - curHigh);
                if (distLow <= distHigh) {
                    activeThumbRef.current = 'low';
                    const newLow = Math.min(val, curHigh);
                    changeCb?.(newLow, curHigh, true);
                } else {
                    activeThumbRef.current = 'high';
                    const newHigh = Math.max(val, curLow);
                    changeCb?.(curLow, newHigh, true);
                }
            }
        },
        onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
            const {
                safeLow: curLow,
                safeHigh: curHigh,
                disableRange: isSingle,
                onValueChanged: changeCb
            } = propsRef.current;

            const currentX = gestureState.moveX - containerLeftRef.current;
            const val = getValueFromX(currentX);

            if (isSingle) {
                changeCb?.(val, curHigh, true);
            } else {
                if (activeThumbRef.current === 'low') {
                    const newLow = Math.min(val, curHigh);
                    changeCb?.(newLow, curHigh, true);
                } else {
                    const newHigh = Math.max(val, curLow);
                    changeCb?.(curLow, newHigh, true);
                }
            }
        }
    }), []);

    const defaultRail = (
        <View style={[styles.defaultRail, { backgroundColor: sliderRailUnselectedColor }]} />
    );

    const defaultRailSelected = (
        <View style={[styles.defaultRailSelected, { backgroundColor: sliderRailSelectedColor }]} />
    );

    const defaultThumb = (
        <View style={styles.defaultThumb} />
    );

    const selectedRailStyle = disableRange
        ? {
            left: 0,
            width: lowThumbLeft + THUMB_RADIUS,
        }
        : {
            left: lowThumbLeft + THUMB_RADIUS,
            width: Math.max(0, highThumbLeft - lowThumbLeft),
        };

    return (
        <View
            style={[styles.container, style]}
            onLayout={handleLayout}
            {...panResponder.panHandlers}
            {...props}
        >
            <View style={styles.railContainer} pointerEvents="none">
                {renderRail()}
                <View
                    style={[
                        styles.selectedRailContainer,
                        selectedRailStyle
                    ]}
                >
                    {renderRailSelected()}
                </View>
            </View>

            <View
                pointerEvents="none"
                style={[
                    styles.thumbContainer,
                    {
                        transform: [{ translateX: lowThumbLeft }]
                    }
                ]}
            >
                {renderThumb('low')}
            </View>

            {!disableRange && (
                <View
                    pointerEvents="none"
                    style={[
                        styles.thumbContainer,
                        {
                            transform: [{ translateX: highThumbLeft }]
                        }
                    ]}
                >
                    {renderThumb('high')}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'center',
        position: 'relative',
    },
    railContainer: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
    },
    selectedRailContainer: {
        position: 'absolute',
        top: 0,
        height: '100%',
        overflow: 'hidden',
    },
    defaultRail: {
        width: '100%',
        height: '100%',
        borderRadius: 2,
    },
    defaultRailSelected: {
        width: '100%',
        height: '100%',
        borderRadius: 2,
    },
    thumbContainer: {
        position: 'absolute',
        left: 0,
        width: THUMB_RADIUS * 2,
        height: THUMB_RADIUS * 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultThumb: {
        width: THUMB_RADIUS * 2,
        height: THUMB_RADIUS * 2,
        borderRadius: THUMB_RADIUS,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        backgroundColor: '#FFFFFF',
    },
});
