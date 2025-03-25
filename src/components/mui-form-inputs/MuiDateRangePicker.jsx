import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";

const MuiDateRangePicker = ({
  control,
  startName,
  endName,
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
        name={startName}
        render={({ field: startField }) => (
          <Controller
            control={control}
            name={endName}
            render={({ field: endField }) => (
              <DateRangePicker
                value={[
                  startField.value ? dayjs(startField.value) : null,
                  disableEndDate ? null : endField.value ? dayjs(endField.value) : null,
                ]}
                className="mui-custom-daterange-picker"
                onChange={(newValue) => {
                  const formattedDeparture = newValue[0]
                    ? newValue[0].format("YYYY-MM-DD")
                    : null;
                  const formattedReturn =
                    disableEndDate || !newValue[1] ? null : newValue[1].format("YYYY-MM-DD");

                  startField.onChange(formattedDeparture);
                  if (!disableEndDate) {
                    endField.onChange(formattedReturn);
                  }

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
        )}
      />
    </LocalizationProvider>
  );
};

export default MuiDateRangePicker;
