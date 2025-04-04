"use client";
import { useState } from "react";

import { Controller } from "react-hook-form";
import Datepicker from "react-tailwindcss-datepicker";
import "./TailwindComponents.css";

const TailwindDateRangePicker = ({
    control,
    startName,
    endName,
    label = "Date Range",
    onChange,
    className,
    minDate,
    maxDate,
}) => {
    const [value, setValue] = useState({
        startDate: null,
        endDate: null,
    });

    const handleChange = (newValue) => {
        if (newValue) {
            setValue(newValue);

            const formattedStart = newValue.startDate
                ? new Date(newValue.startDate).toISOString().split("T")[0]
                : null;

            const formattedEnd = newValue.endDate
                ? new Date(newValue.endDate).toISOString().split("T")[0]
                : null;

            if (onChange) {
                onChange(formattedStart, formattedEnd);
            }
        }
    };

    return (
        <div className="relative z-20">
            {label && <label htmlFor={startName} className="absolute left-3 -top-2 bg-white text-sm z-10">{label}</label>}
            <Controller
                control={control}
                name={startName}
                render={({ field: startField }) => (
                    <Controller
                        control={control}
                        name={endName}
                        render={({ field: endField }) => (
                            <div className={`${className} tailwind-date-range`}>
                                <Datepicker
                                    value={value}
                                    onChange={(newValue) => {
                                        handleChange(newValue);
                                        startField.onChange(newValue?.startDate);
                                        endField.onChange(newValue?.endDate);
                                    }}
                                    showShortcuts={true}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    primaryColor="blue"
                                />
                            </div>
                        )}
                    />
                )}
            />
        </div>
    );
};

export default TailwindDateRangePicker;
