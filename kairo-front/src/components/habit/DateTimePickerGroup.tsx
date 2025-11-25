import React from 'react';
import {Platform, Text, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar, Clock} from '@tamagui/lucide-icons';
import PickerButton from '@/src/components/PickerButton';
import PickerModal from './PickerModal';
import {formatDateDisplay} from '@/src/hooks/useDateTimePickers';
import {oneHabitStyles} from '@/global'

interface DateTimePickerGroupProps {
    notificationTime: string;
    showTimePicker: boolean;
    tempTime: Date;
    onTimeChange: (event: any, selected?: Date) => void;
    openTimePicker: () => void;
    confirmTime: () => void;
    closeTimePicker: () => void;

    startDate: string;
    showStartDatePicker: boolean;
    tempStartDate: Date;
    onStartDateChange: (event: any, selected?: Date) => void;
    openStartDatePicker: () => void;
    confirmStartDate: () => void;
    closeStartDatePicker: () => void;

    endDate: string;
    showEndDatePicker: boolean;
    tempEndDate: Date;
    onEndDateChange: (event: any, selected?: Date) => void;
    openEndDatePicker: () => void;
    confirmEndDate: () => void;
    closeEndDatePicker: () => void;
}

export default function DateTimePickerGroup(props: DateTimePickerGroupProps) {
    return (
        <>
            <Text style={oneHabitStyles.sectionTitle}>Schedule & Reminders</Text>

            <View style={oneHabitStyles.inputGroup}>
                <Text style={oneHabitStyles.label}>Notification Time</Text>
                <PickerButton
                    icon={Clock}
                    value={props.notificationTime}
                    placeholder="Select time"
                    onPress={props.openTimePicker}
                />
            </View>

            <View style={oneHabitStyles.inputGroup}>
                <Text style={oneHabitStyles.label}>Start Date</Text>
                <PickerButton
                    icon={Calendar}
                    value={props.startDate ? formatDateDisplay(props.startDate) : ''}
                    placeholder="Select start date"
                    onPress={props.openStartDatePicker}
                />
            </View>

            <View style={oneHabitStyles.inputGroup}>
                <Text style={oneHabitStyles.label}>End Date</Text>
                <PickerButton
                    icon={Calendar}
                    value={props.endDate ? formatDateDisplay(props.endDate) : ''}
                    placeholder="Select end date"
                    onPress={props.openEndDatePicker}
                />
            </View>


            {/*kocham ios <333  daj znac czy dziala na androidzie bo tutaj zabawa zeby to ladnie wygladalo*/}
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
                            style={{ height: 200 }}
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
                            style={{ height: 200 }}
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
                            style={{ height: 200 }}
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

