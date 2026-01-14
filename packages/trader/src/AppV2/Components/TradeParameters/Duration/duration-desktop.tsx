import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

import { TabSelector } from '../../InputPopover';
import { ChipsWithInputToggle } from '../Shared';
import TradeParameterPopover, { useTradeParameterPopover } from '../Shared/TradeParameterPopover';

import DurationEndTimeDesktop from './duration-end-time-desktop';
import DurationHoursInputDesktop from './duration-hours-input-desktop';
import DurationInputDesktop from './duration-input-desktop';
import DurationTicksInputDesktop from './duration-ticks-input-desktop';
import DurationUnitSelector from './duration-unit-selector';

const DURATION_TICK_VALUES = [1, 2, 3, 4, 5, 6, 7, 8];
const DURATION_SECONDS_VALUES = [1, 20, 25, 30, 40, 50];
const DURATION_MINUTES_VALUES = [1, 2, 3, 4, 5, 10];
const DURATION_HOURS_VALUES = [1, 2, 3, 4, 6, 8];
const DURATION_END_TIME_VALUES = ['07:30', '07:35', '07:40', '07:45', '07:50', '07:55'];
const DURATION_END_DATE_VALUES = [1, 2, 3, 5, 7, 10]; // Days from now

interface DurationDesktopProps {
    is_minimized?: boolean;
}

const DurationPopoverContent: React.FC<{
    selectedUnit: string;
    activeTab: 'chips' | 'input';
    selectedDuration: number;
    onDurationSelect: (value: number) => void;
    onHourSelect: (hours: number) => void;
    onEndTimeSelect: (time: string) => void;
    onEndDateSelect: (days: number) => void;
    onUnitSelect: (unit: string) => void;
    onTabChange: (tab: 'chips' | 'input') => void;
    formatTickValue: (value: number) => string;
    formatSecondsValue: (value: number) => string;
    formatMinutesValue: (value: number) => string;
    formatHoursValue: (value: number) => string;
    formatEndTimeValue: (value: string) => string;
    formatEndDateValue: (value: number) => string;
}> = ({
    selectedUnit,
    activeTab,
    selectedDuration,
    onDurationSelect,
    onHourSelect,
    onEndTimeSelect,
    onEndDateSelect,
    onUnitSelect,
    onTabChange,
    formatTickValue,
    formatSecondsValue,
    formatMinutesValue,
    formatHoursValue,
    formatEndTimeValue,
    formatEndDateValue,
}) => {
    const { closePopover } = useTradeParameterPopover();

    const handleDurationSelectAndClose = useCallback(
        (value: number) => {
            onDurationSelect(value);
            closePopover();
        },
        [onDurationSelect, closePopover]
    );

    const handleHourSelectAndClose = useCallback(
        (hours: number) => {
            onHourSelect(hours);
            closePopover();
        },
        [onHourSelect, closePopover]
    );

    const handleEndTimeSelectAndClose = useCallback(
        (time: string) => {
            onEndTimeSelect(time);
            closePopover();
        },
        [onEndTimeSelect, closePopover]
    );

    const handleEndDateSelectAndClose = useCallback(
        (days: number) => {
            onEndDateSelect(days);
            closePopover();
        },
        [onEndDateSelect, closePopover]
    );

    const getDurationConfig = useCallback(() => {
        const configs: Record<
            string,
            {
                chipValues: any[];
                selectedValue: any;
                onSelect: any;
                formatValue: any;
                inputComponent: React.ReactNode;
            } | null
        > = {
            t: {
                chipValues: DURATION_TICK_VALUES,
                selectedValue: selectedDuration,
                onSelect: handleDurationSelectAndClose,
                formatValue: formatTickValue,
                inputComponent: <DurationTicksInputDesktop onClose={closePopover} />,
            },
            s: {
                chipValues: DURATION_SECONDS_VALUES,
                selectedValue: selectedDuration,
                onSelect: handleDurationSelectAndClose,
                formatValue: formatSecondsValue,
                inputComponent: <DurationInputDesktop unit='s' onClose={closePopover} />,
            },
            m: {
                chipValues: DURATION_MINUTES_VALUES,
                selectedValue: selectedDuration,
                onSelect: handleDurationSelectAndClose,
                formatValue: formatMinutesValue,
                inputComponent: <DurationInputDesktop unit='m' onClose={closePopover} />,
            },
            h: {
                chipValues: DURATION_HOURS_VALUES,
                selectedValue: Math.floor(selectedDuration / 60),
                onSelect: handleHourSelectAndClose,
                formatValue: formatHoursValue,
                inputComponent: <DurationHoursInputDesktop onClose={closePopover} />,
            },
            end_time: {
                chipValues: DURATION_END_TIME_VALUES,
                selectedValue: DURATION_END_TIME_VALUES[0],
                onSelect: handleEndTimeSelectAndClose,
                formatValue: formatEndTimeValue,
                inputComponent: <DurationEndTimeDesktop onClose={closePopover} />,
            },
            end_date: {
                chipValues: DURATION_END_DATE_VALUES,
                selectedValue: selectedDuration,
                onSelect: handleEndDateSelectAndClose,
                formatValue: formatEndDateValue,
                inputComponent: (
                    <div className='duration-popover__coming-soon'>
                        <Text size='md' color='quill-typography-default'>
                            <Localize i18n_default_text='End date manual input coming soon' />
                        </Text>
                    </div>
                ),
            },
        };
        return configs[selectedUnit] || null;
    }, [
        selectedUnit,
        selectedDuration,
        handleDurationSelectAndClose,
        handleHourSelectAndClose,
        handleEndTimeSelectAndClose,
        handleEndDateSelectAndClose,
        formatTickValue,
        formatSecondsValue,
        formatMinutesValue,
        formatHoursValue,
        formatEndTimeValue,
        formatEndDateValue,
        closePopover,
    ]);

    const config = getDurationConfig();

    return (
        <div className='duration-popover__layout'>
            <div className='duration-popover__sidebar'>
                <DurationUnitSelector selectedUnit={selectedUnit} onSelectUnit={onUnitSelect} />
            </div>
            <div className='duration-popover__main'>
                {config && (
                    <div className='duration-popover__header'>
                        <TabSelector activeTab={activeTab} onTabChange={onTabChange} />
                    </div>
                )}
                <div className='duration-popover__content'>
                    {config ? (
                        <ChipsWithInputToggle
                            activeTab={activeTab}
                            chipValues={config.chipValues}
                            selectedValue={config.selectedValue}
                            onSelect={config.onSelect}
                            formatValue={config.formatValue}
                            inputComponent={config.inputComponent}
                        />
                    ) : (
                        <div className='duration-popover__coming-soon'>
                            <Text size='md' color='quill-typography-default'>
                                <Localize i18n_default_text='Coming soon' />
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DurationDesktop: React.FC<DurationDesktopProps> = observer(({ is_minimized }) => {
    const { duration, duration_unit, onChangeMultiple, is_market_closed } = useTraderStore();

    const [selectedUnit, setSelectedUnit] = useState('t'); // Default to Ticks
    const [selectedDuration, setSelectedDuration] = useState(duration);
    const [activeTab, setActiveTab] = useState<'chips' | 'input'>('chips');

    const handleOpenPopover = useCallback(() => {
        setSelectedUnit(
            duration_unit === 's'
                ? 's'
                : duration_unit === 'm'
                  ? 'm'
                  : duration_unit === 'h'
                    ? 'h'
                    : duration_unit === 'end_time'
                      ? 'end_time'
                      : 't'
        );
        setSelectedDuration(duration);
        setActiveTab('chips'); // Always start with chips tab
    }, [duration, duration_unit]);

    const handleClosePopover = useCallback(() => {
        setActiveTab('chips'); // Reset to chips tab on close
    }, []);

    const handleUnitSelect = useCallback((unit: string) => {
        setSelectedUnit(unit);
        setActiveTab('chips'); // Reset to chips tab when changing units
    }, []);

    const handleTabChange = useCallback((tab: 'chips' | 'input') => {
        setActiveTab(tab);
    }, []);

    const handleDurationSelect = useCallback(
        (value: number) => {
            setSelectedDuration(value);
            // Apply the change immediately based on selected unit
            onChangeMultiple({
                duration_unit: selectedUnit,
                duration: value,
                expiry_type: 'duration',
            });
        },
        [selectedUnit, onChangeMultiple]
    );

    const handleHourSelect = useCallback(
        (hours: number) => {
            const totalMinutes = hours * 60;
            setSelectedDuration(totalMinutes);
            // Save as minutes
            onChangeMultiple({
                duration_unit: 'm',
                duration: totalMinutes,
                expiry_type: 'duration',
            });
        },
        [onChangeMultiple]
    );

    const formatTickValue = useCallback((value: number) => {
        return localize('{{count}} {{tick_label}}', {
            count: value,
            tick_label: value === 1 ? localize('tick') : localize('ticks'),
        });
    }, []);

    const formatSecondsValue = useCallback((value: number) => {
        return localize('{{count}} {{second_label}}', {
            count: value,
            second_label: value === 1 ? localize('second') : localize('seconds'),
        });
    }, []);

    const formatMinutesValue = useCallback((value: number) => {
        return localize('{{count}} {{minute_label}}', {
            count: value,
            minute_label: value === 1 ? localize('minute') : localize('minutes'),
        });
    }, []);

    const formatHoursValue = useCallback((value: number) => {
        return localize('{{count}} hr', {
            count: value,
        });
    }, []);

    const formatEndTimeValue = useCallback((value: string) => {
        return value; // Time is already formatted as HH:MM
    }, []);

    const formatEndDateValue = useCallback((value: number) => {
        const date = new Date();
        date.setDate(date.getDate() + value);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        return `${day} ${month}`;
    }, []);

    const handleEndTimeSelect = useCallback(
        (time: string) => {
            onChangeMultiple({
                expiry_type: 'endtime',
                expiry_time: time,
            });
        },
        [onChangeMultiple]
    );

    const handleEndDateSelect = useCallback(
        (days: number) => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            const formattedDate = date.toISOString().split('T')[0];
            onChangeMultiple({
                expiry_type: 'endtime',
                expiry_date: formattedDate,
            });
        },
        [onChangeMultiple]
    );

    const getDisplayValue = useCallback(() => {
        if (duration_unit === 't') {
            return formatTickValue(duration);
        }
        if (duration_unit === 's') {
            return formatSecondsValue(duration);
        }
        if (duration_unit === 'm') {
            // Check if this is hours (stored as minutes)
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;

            // If it's a whole hour value (no remainder), display as hours
            if (minutes === 0 && hours > 0) {
                return localize('{{count}} {{hour_label}}', {
                    count: hours,
                    hour_label: hours === 1 ? localize('hour') : localize('hours'),
                });
            }
            // If it has both hours and minutes
            if (hours > 0 && minutes > 0) {
                return localize('{{hours_count}} {{hour_label}} {{minutes_count}} {{minute_label}}', {
                    hours_count: hours,
                    hour_label: hours === 1 ? localize('hour') : localize('hours'),
                    minutes_count: minutes,
                    minute_label: minutes === 1 ? localize('minute') : localize('minutes'),
                });
            }
            // Otherwise display as minutes
            return formatMinutesValue(duration);
        }
        return `${duration} ${duration_unit}`;
    }, [duration, duration_unit, formatTickValue, formatSecondsValue, formatMinutesValue]);

    return (
        <TradeParameterPopover
            popoverWidth={360}
            label={<Localize i18n_default_text='Duration' key={`duration${is_minimized ? '-minimized' : ''}`} />}
            is_minimized={is_minimized}
            disabled={is_market_closed}
            popover_classname='duration-popover'
            value={getDisplayValue()}
            onOpen={handleOpenPopover}
            onClose={handleClosePopover}
        >
            <DurationPopoverContent
                selectedUnit={selectedUnit}
                activeTab={activeTab}
                selectedDuration={selectedDuration}
                onDurationSelect={handleDurationSelect}
                onHourSelect={handleHourSelect}
                onEndTimeSelect={handleEndTimeSelect}
                onEndDateSelect={handleEndDateSelect}
                onUnitSelect={handleUnitSelect}
                onTabChange={handleTabChange}
                formatTickValue={formatTickValue}
                formatSecondsValue={formatSecondsValue}
                formatMinutesValue={formatMinutesValue}
                formatHoursValue={formatHoursValue}
                formatEndTimeValue={formatEndTimeValue}
                formatEndDateValue={formatEndDateValue}
            />
        </TradeParameterPopover>
    );
});

export default DurationDesktop;
