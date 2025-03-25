"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

const DateSelector = ({ departure_date, return_date, route_type }) => {
    const router = useRouter();
    const searchParams = useSearchParams(); // Get current query params

    // Initialize state from query params or props
    const [departureDate, setDepartureDate] = useState(dayjs(departure_date));
    const [returnDate, setReturnDate] = useState(dayjs(return_date));

    const generateDates = (selectedDate) => {
        const daysBefore = 3;
        const daysAfter = 3;
        const dates = [];

        for (let i = -daysBefore; i <= daysAfter; i++) {
            dates.push(selectedDate.add(i, "day"));
        }

        return dates;
    };

    const initialGap = returnDate.diff(departureDate, "day");

    const generateDatePairs = (selectedDate) => {
        const daysBefore = 3;
        const daysAfter = 3;
        const datePairs = [];

        for (let i = -daysBefore; i <= daysAfter; i++) {
            const dep = selectedDate.add(i, "day");
            const ret = dep.add(initialGap, "day");
            datePairs.push({ dep, ret });
        }

        return datePairs;
    };

    const handleDateSelection = (depDate, retDate) => {
        const params = new URLSearchParams(searchParams.toString()); // Preserve existing params

        setDepartureDate(depDate);
        params.set("departure_date", depDate.format("YYYY-MM-DD"));

        if (retDate) {
            setReturnDate(retDate);
            params.set("return_date", retDate.format("YYYY-MM-DD"));
        }

        router.push(`/flights/search/result?${params.toString()}`);
    };

    useEffect(() => {
        if (departureDate) {
            fetchData(departureDate.format("YYYY-MM-DD"));
        }
    }, [departureDate]);

    useEffect(() => {
        setDepartureDate(dayjs(departure_date));
    }, [departure_date]);

    useEffect(() => {
        setReturnDate(dayjs(return_date));
    }, [return_date]);

    const fetchData = async (date) => {
        console.log("Fetching API for departure date:", date);
        // Call your API here
    };

    return (
        <div className="flex items-center justify-center mb-5 space-x-8">
            {/* Departure Date Selector */}
            {route_type === "ONEWAY" && (
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    {generateDates(departureDate).map((date, index) => (
                        <div
                            key={index}
                            className={`px-6 py-3 rounded-md text-center text-sm font-medium 
                                ${date.isBefore(dayjs(), "day") ? "bg-gray-300 text-gray-500 cursor-not-allowed" :
                                    date.isSame(departureDate, "day") ? "bg-blue-200 text-black font-semibold cursor-pointer" : "bg-white cursor-pointer"}`}
                            onClick={() => !date.isBefore(dayjs(), "day") && handleDateSelection(date)} // Prevent click on past dates
                        >
                            <div>{date.format("ddd DD MMM")}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Return Date Selector (Only Show When RETURN) */}
            {route_type === "RETURN" && (
                <div className="flex space-x-5 overflow-x-auto scrollbar-hide">
                    {generateDatePairs(departureDate).map((pair, index) => (
                        <div
                            key={index}
                            className={`px-5 py-3 rounded-md text-center text-sm font-medium h-max
                                ${pair.dep.isBefore(dayjs(), "day")
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disable past dates
                                    : pair.dep.isSame(departureDate, "day") && pair.ret.isSame(returnDate, "day")
                                        ? "bg-blue-200 text-black font-semibold cursor-pointer"
                                        : "bg-white cursor-pointer"
                                }`}
                            onClick={() => !pair.dep.isBefore(dayjs(), "day") && handleDateSelection(pair.dep, pair.ret)} // Prevent clicks on past dates
                        >
                            <div className="flex flex-col items-center">
                                <span>{pair.dep.format("ddd, DD MMM")}</span>
                                <span className="text-blue-500 text-lg font-bold leading-3">⇌</span>
                                <span>{pair.ret.format("ddd, DD MMM")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DateSelector;
