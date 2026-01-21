import React from 'react';
import {Platform, Text, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar, Clock} from '@tamagui/lucide-icons';
import PickerButton from '@/src/components/PickerButton';
import PickerModal from './PickerModal';
import {formatDateDisplay} from '@/src/hooks/useDateTimePickers';
import {DateTimePickerGroupProps} from "@/src/types/DateTimePickerGroupProps";
import {ThemeColors} from '@/src/contexts/ThemeContext';
import {useThemedStyles} from '@/src/hooks/useThemedStyles';

export default function DateTimePickerGroup(props: DateTimePickerGroupProps) {
    const styles = useDateTimePickerGroupStyles();
    return (
        <>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Notification Time</Text>
                <PickerButton
                    icon={Clock}
                    value={props.notificationTime}
                    placeholder="Select time"
                    onPress={props.openTimePicker}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Start Date</Text>
                <PickerButton
                    icon={Calendar}
                    value={props.startDate ? formatDateDisplay(props.startDate) : ''}
                    placeholder="Select start date"
                    onPress={props.openStartDatePicker}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date</Text>
                <PickerButton
                    icon={Calendar}
                    value={props.endDate ? formatDateDisplay(props.endDate) : ''}
                    placeholder="Select end date"
                    onPress={props.openEndDatePicker}
                />
            </View>

            
            {Platform.OS === 'ios' ? (
                <>
                    <PickerModal
                        visible={props.showTimePicker}
                        onClose={props.closeTimePicker}
                        onConfirm={props.confirmTime}
                        title="Select Time"
                    >
                        <DateTimePicker
                            value={props.tempTime}
                            mode="time"
                            is24Hour
                            display="spinner"
                            onChange={props.onTimeChange}
                            style={{height: 200}}
                            themeVariant="light"
                        />
                    </PickerModal>

                    <PickerModal
                        visible={props.showStartDatePicker}
                        onClose={props.closeStartDatePicker}
                        onConfirm={props.confirmStartDate}
                        title="Select Start Date"
                    >
                        <DateTimePicker
                            value={props.tempStartDate}
                            mode="date"
                            display="spinner"
                            onChange={props.onStartDateChange}
                            style={{height: 200}}
                            themeVariant="light"
                        />
                    </PickerModal>

                    <PickerModal
                        visible={props.showEndDatePicker}
                        onClose={props.closeEndDatePicker}
                        onConfirm={props.confirmEndDate}
                        title="Select End Date"
                    >
                        <DateTimePicker
                            value={props.tempEndDate}
                            mode="date"
                            display="spinner"
                            onChange={props.onEndDateChange}
                            style={{height: 200}}
                            themeVariant="light"
                        />
                    </PickerModal>
                </>
            ) : (
                <>
                    {props.showTimePicker && (
                        <DateTimePicker
                            value={props.tempTime}
                            mode="time"
                            is24Hour
                            display="default"
                            onChange={props.onTimeChange}
                        />
                    )}
                    {props.showStartDatePicker && (
                        <DateTimePicker
                            value={props.tempStartDate}
                            mode="date"
                            display="default"
                            onChange={props.onStartDateChange}
                        />
                    )}
                    {props.showEndDatePicker && (
                        <DateTimePicker
                            value={props.tempEndDate}
                            mode="date"
                            display="default"
                            onChange={props.onEndDateChange}
                        />
                    )}
                </>
            )}
        </>
    );
}

const createDateTimePickerGroupStyles = (colors: ThemeColors) => ({
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
});

function useDateTimePickerGroupStyles() {
    return useThemedStyles(createDateTimePickerGroupStyles);
}

