import {useCallback, useState} from 'react';
import {Platform} from 'react-native';

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
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
}

interface InitializationParams {
    notificationTime?: string | null;
    startDate?: string | null;
    endDate?: string | null;
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
            setTempTime(new Date(`2025-01-01T${notificationTime}:00`));
        } else {
            setTempTime(new Date());
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
        } else {
            setTempStartDate(new Date());
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
        } else {
            setTempEndDate(new Date());
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


    const initialize = useCallback((params: InitializationParams) => {
        // czas powiadomienia
        const initialTimeStr = params.notificationTime || '';
        setNotificationTime(initialTimeStr);
        if (initialTimeStr) {
            setTempTime(new Date(`2025-01-01T${initialTimeStr}:00`));
        } else {
            setTempTime(new Date());
        }

        // data rozpoczęcia
        const initialStartDateStr = params.startDate || '';
        setStartDate(initialStartDateStr);
        if (initialStartDateStr) {
            setTempStartDate(new Date(initialStartDateStr));
        } else {
            setTempStartDate(new Date());
        }

        // data zakończenia
        const initialEndDateStr = params.endDate || '';
        setEndDate(initialEndDateStr);
        if (initialEndDateStr) {
            setTempEndDate(new Date(initialEndDateStr));
        } else {
            setTempEndDate(new Date());
        }
    }, []);


    return {
        // Czas
        notificationTime,
        showTimePicker,
        tempTime,
        openTimePicker,
        onTimeChange,
        confirmTime,
        closeTimePicker: () => setShowTimePicker(false),

        // Data rozpoczęcia
        startDate,
        showStartDatePicker,
        tempStartDate,
        openStartDatePicker,
        onStartDateChange,
        confirmStartDate,
        closeStartDatePicker: () => setShowStartDatePicker(false),

        // Data zakończenia
        endDate,
        showEndDatePicker,
        tempEndDate,
        openEndDatePicker,
        onEndDateChange,
        confirmEndDate,
        closeEndDatePicker: () => setShowEndDatePicker(false),

        initialize,
    };
}