export interface DateTimePickerGroupProps {
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
