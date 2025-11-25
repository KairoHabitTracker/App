import {useCallback, useState} from 'react';
import {Platform} from 'react-native';

// Helper functions
function pad(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}

function formatTimeFromDate(d: Date) {
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateISO(d: Date) {
    return d.toISOString().slice(0, 10);
}

export function formatDateDisplay(dateStr: string) {
    if (!dateStr) return 'Select date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function useDateTimePickers() {
    const [notificationTime, setNotificationTime] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tempTime, setTempTime] = useState(new Date());

    const [startDate, setStartDate] = useState('');
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(new Date());

    const [endDate, setEndDate] = useState('');
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [tempEndDate, setTempEndDate] = useState(new Date());

    const openTimePicker = useCallback(() => {
        if (notificationTime) {
            setTempTime(new Date(`1970-01-01T${notificationTime}:00`));
        }
        setShowTimePicker(true);
    }, [notificationTime]);

    const onTimeChange = useCallback((_event: any, selected?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
            if (selected) {
                setNotificationTime(formatTimeFromDate(selected));
            }
        } else {
            if (selected) setTempTime(selected);
        }
    }, []);

    const confirmTime = useCallback(() => {
        setNotificationTime(formatTimeFromDate(tempTime));
        setShowTimePicker(false);
    }, [tempTime]);

    const openStartDatePicker = useCallback(() => {
        if (startDate) {
            setTempStartDate(new Date(startDate));
        }
        setShowStartDatePicker(true);
    }, [startDate]);

    const onStartDateChange = useCallback((_event: any, selected?: Date) => {
        if (Platform.OS === 'android') {
            setShowStartDatePicker(false);
            if (selected) {
                setStartDate(formatDateISO(selected));
            }
        } else {
            if (selected) setTempStartDate(selected);
        }
    }, []);

    const confirmStartDate = useCallback(() => {
        setStartDate(formatDateISO(tempStartDate));
        setShowStartDatePicker(false);
    }, [tempStartDate]);

    const openEndDatePicker = useCallback(() => {
        if (endDate) {
            setTempEndDate(new Date(endDate));
        }
        setShowEndDatePicker(true);
    }, [endDate]);

    const onEndDateChange = useCallback((_event: any, selected?: Date) => {
        if (Platform.OS === 'android') {
            setShowEndDatePicker(false);
            if (selected) {
                setEndDate(formatDateISO(selected));
            }
        } else {
            if (selected) setTempEndDate(selected);
        }
    }, []);

    const confirmEndDate = useCallback(() => {
        setEndDate(formatDateISO(tempEndDate));
        setShowEndDatePicker(false);
    }, [tempEndDate]);

    return {
        notificationTime,
        showTimePicker,
        tempTime,
        openTimePicker,
        onTimeChange,
        confirmTime,
        closeTimePicker: () => setShowTimePicker(false),

        startDate,
        showStartDatePicker,
        tempStartDate,
        openStartDatePicker,
        onStartDateChange,
        confirmStartDate,
        closeStartDatePicker: () => setShowStartDatePicker(false),

        endDate,
        showEndDatePicker,
        tempEndDate,
        openEndDatePicker,
        onEndDateChange,
        confirmEndDate,
        closeEndDatePicker: () => setShowEndDatePicker(false),
    };
}