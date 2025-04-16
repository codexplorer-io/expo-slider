import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import RnRangeSlider from 'rn-range-slider';
import Color from 'color';
import { useTheme } from 'react-native-paper';

const THUMB_RADIUS = 14;
const THUMB_COLOR = 'white';
const BORDER_COLOR = Color('black').fade(0.8).toString();

const SliderThumbRoot = styled.View`
    width: ${THUMB_RADIUS * 2}px;
    height: ${THUMB_RADIUS * 2}px;
    border-radius: ${THUMB_RADIUS}px;
    border-width: 2px;
    border-color: ${BORDER_COLOR};
    background-color: ${THUMB_COLOR};
`;

const SliderRailRoot = styled.View`
    ${({ isSelected }) => !isSelected && 'flex: 1;'}
    background-color: ${({ railColor }) => railColor};
    height: 4px;
    border-radius: 2px;
`;

const SliderThumb = () => <SliderThumbRoot />;

const SliderRail = ({ railColor }) => <SliderRailRoot railColor={railColor} />;

const renderThumbDefault = () => <SliderThumb />;

const createRenderRail = ({ railColor }) => () => (
    <SliderRail railColor={railColor} />
);

export const Slider = ({
    renderThumb = renderThumbDefault,
    renderRail,
    renderRailSelected,
    sliderRailSelectedColor,
    sliderRailUnselectedColor,
    ...props
}) => {
    const theme = useTheme();

    const renderRailCustom = useMemo(
        () => renderRail ?? createRenderRail({
            railColor: sliderRailUnselectedColor ?? theme.colors.backgroundDarker
        }),
        [renderRail, sliderRailUnselectedColor, theme.colors.backgroundDarker]
    );

    const renderRailSelectedCustom = useMemo(
        () => renderRailSelected ?? createRenderRail({
            railColor: sliderRailSelectedColor ?? theme.colors.primary
        }),
        [renderRailSelected, sliderRailSelectedColor, theme.colors.primary]
    );

    return (
        <RnRangeSlider
            renderThumb={renderThumb}
            renderRail={renderRailCustom}
            renderRailSelected={renderRailSelectedCustom}
            {...props}
        />
    );
};
