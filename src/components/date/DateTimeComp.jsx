import dayjs from 'dayjs';
import React from 'react'

const DateTimeComp = ({ formattedDate }) => {
    return (
        <div className='flex flex-col items-center justify-center gap-1'>
            <span className='whitespace-nowrap text-base bold'>{dayjs(formattedDate).format("MM-DD-YYYY")}</span>
            <span>{dayjs(formattedDate).format("HH:mm A")}</span>
        </div>
    )
}

export default DateTimeComp
