

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardContent,
    Typography
} from '@mui/material'

const SabrePricingSummary = ({ bookingAvailabilityConfirmationData }) => {
    return (
        <>
            {bookingAvailabilityConfirmationData?.fareInfoList?.length > 0 && (
                <Card className='bg-base-100 mb-5'>
                    <CardContent>
                        <Typography variant='h6' fontWeight='600' mb={2}>
                            Price Summary
                        </Typography>

                        {bookingAvailabilityConfirmationData?.fareInfoList[0]?.price?.fare_break_down &&
                            Object.entries(
                                bookingAvailabilityConfirmationData?.fareInfoList[0]?.price?.fare_break_down
                            ).length > 0 && (
                                <div>
                                    {Object.entries(
                                        bookingAvailabilityConfirmationData?.fareInfoList[0]?.price?.fare_break_down
                                    ).map(([key, data], index) => {
                                        const passengerType =
                                            key === 'ADT' ? 'Adult' : key === 'CNN' ? 'Child' : key === 'INF' ? 'Infant' : key

                                        return (
                                            <div key={index} className='flex justify-between border-b pb-2'>
                                                <p className='font-semibold'>
                                                    {bookingAvailabilityConfirmationData?.airline?.iata_code} ({passengerType}) x{' '}
                                                    {data?.quantity}:
                                                </p>
                                                <p className='text-gray-400'>
                                                    {data?.prices?.currency} {data?.prices?.gross_amount}
                                                </p>
                                            </div>
                                        )
                                    })}

                                    <div className='flex mt-4 border-b pb-2'>
                                        <h4 className='font-semibold'>Price you Pay:</h4>
                                        <h4 className='text-primary font-bold ml-[55px]'>
                                            {bookingAvailabilityConfirmationData?.fareInfoList[0]?.price?.currency}{' '}
                                            {bookingAvailabilityConfirmationData?.fareInfoList[0]?.price?.gross_amount}
                                        </h4>
                                    </div>
                                </div>
                            )}

                        <Accordion
                            className='p-0'
                            disableGutters
                            elevation={0}
                            square
                            sx={{
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                '&.Mui-expanded': {
                                    margin: 0,
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <div className=' text-black rounded-full w-8 flex items-center justify-center'>
                                        <ExpandMoreIcon />
                                    </div>
                                }
                                className='text-lg font-bold !px-0'
                            >
                                <h1 className='text-lg font-bold'>Fare Breakdown</h1>
                            </AccordionSummary>

                            <AccordionDetails className='!p-0'>
                                <div className='space-y-5'>
                                    {bookingAvailabilityConfirmationData?.fareInfoList[0]?.price?.fare_break_down &&
                                        Object.entries(
                                            bookingAvailabilityConfirmationData?.fareInfoList[0]?.price?.fare_break_down
                                        ).map(([key, data], index) => {
                                            const passengerType =
                                                key === 'ADT'
                                                    ? 'Adult'
                                                    : key === 'CHILD'
                                                        ? 'Child'
                                                        : key === 'INF'
                                                            ? 'Infant'
                                                            : key

                                            return (
                                                <div key={index} className=''>
                                                    <Typography className='px-0'>
                                                        <h2 className='font-semibold text-lg py-3'>{passengerType}</h2>
                                                    </Typography>
                                                    <hr className='mb-2 mt-0' />
                                                    <div>
                                                        <div className='flex justify-between items-center mb-1'>
                                                            <p className='text-gray-800 text-sm font-semibold'>Base Fare:</p>
                                                            <p className='text-gray text-sm font-semibold text-end'>
                                                                {data?.prices?.currency} {data?.prices?.base_fare}
                                                            </p>
                                                        </div>
                                                        <div className='flex justify-between items-center mb-1'>
                                                            <p className='text-gray-800 text-sm font-semibold'>Tax:</p>
                                                            <p className='text-gray text-sm font-semibold text-end'>
                                                                {data?.prices?.currency} {data?.prices?.tax}
                                                            </p>
                                                        </div>
                                                        <div className='flex justify-between items-center mb-1'>
                                                            <p className='text-gray-800 text-sm font-semibold'>Gross Fare:</p>
                                                            <p className='text-gray text-sm font-semibold text-end'>
                                                                {data?.prices?.currency} {data?.prices?.gross_amount}
                                                            </p>
                                                        </div>
                                                        <hr className='border mt-3' />
                                                        <div className='flex justify-between mt-4'>
                                                            <h4 className='font-semibold text-lg'>Total to Pay:</h4>
                                                            <h4 className='text-blue-600 font-bold text-lg'>
                                                                {data?.prices?.currency} {data?.prices?.gross_amount}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default SabrePricingSummary
