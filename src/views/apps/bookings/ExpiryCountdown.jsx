import React, { useEffect, useState } from "react";

import { Countdown } from "@/components/Countdown";

const ExpiryCountdown = ({ pnrExpiry, bookingStatus }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const expiryDate = new Date(pnrExpiry.replace(/-/g, '/')).getTime();
            const now = new Date().getTime();
            const difference = expiryDate - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
                
return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds, expired: false });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [pnrExpiry]);

    if (['issued', 'voided', 'refunded', 'cancelled'].includes(bookingStatus)) {
        return (
            <></>
        );
    }

    if (timeLeft.expired) {
        return (
            <p className="text-center text-red-500 font-medium">Expired</p>
        );
    }

    return (

        <div className="mt-3 grid auto-cols-max grid-flow-col gap-1 md:gap-5 text-center">
            {timeLeft.days > 0 && (
                <div className="flex flex-col">
                    <Countdown className="text-xl md:text-lg lg:text-xl xl:text-5xl" value={timeLeft.days} />
                    days
                </div>
            )}
            <div className="flex flex-col">
                <Countdown className="text-xl md:text-lg lg:text-xl xl:text-5xl" value={timeLeft.hours} />
                hours
            </div>
            <div className="flex flex-col">
                <Countdown className="text-xl md:text-lg lg:text-xl xl:text-5xl" value={timeLeft.minutes} />
                min
            </div>
            <div className="flex flex-col">
                <Countdown className="text-xl md:text-lg lg:text-xl xl:text-5xl" value={timeLeft.seconds} />
                sec
            </div>
        </div>
    );
};

export default ExpiryCountdown;
