import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";
import './mui.css';

const MuiDateRangePicker = ({
  control,
  name = "dateRange", // Store as an array [departure, return]
  startLabel = "Departure Date",
  endLabel = "Return Date",
  onChange,
  className,
  disableEndDate = false,
  minDate = dayjs().subtract(100, "year"),
  maxDate,
  size = "medium",
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DateRangePicker
            value={[
              field.value?.[0] ? dayjs(field.value[0]) : null,
              disableEndDate ? null : field.value?.[1] ? dayjs(field.value[1]) : null,
            ]}
            className="mui-custom-daterange-picker"
            onChange={(newValue) => {
              const formattedDeparture = newValue[0] ? newValue[0].format("YYYY-MM-DD") : null;

              const formattedReturn =
                disableEndDate || !newValue[1] ? null : newValue[1].format("YYYY-MM-DD");

              field.onChange([formattedDeparture, formattedReturn]);

              onChange?.(formattedDeparture, formattedReturn);
            }}
            localeText={{ start: startLabel, end: endLabel }}
            shouldDisableDate={(date, position) =>
              position === "start"
                ? minDate && date.isBefore(minDate, "day")
                : disableEndDate
            }
            minDate={minDate}
            maxDate={maxDate}
            slotProps={{
              textField: ({ position }) => ({
                className: `${className} ${disableEndDate && position === "end" ? "bg-gray-200 cursor-not-allowed" : ""
                  }`,
                fullWidth: true,
                size,
                InputProps: {
                  readOnly: disableEndDate && position === "end",
                  disabled: disableEndDate && position === "end",
                },
                disableOpenPicker: disableEndDate && position === "end",
              }),
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default MuiDateRangePicker;
