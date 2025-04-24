'use client'
import {
    Box,
    Button,
    ClickAwayListener,
    Divider,
    Fade,
    IconButton,
    Paper,
    Popper,
    Typography
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

const FareOptionCard = ({ faresGroupData, legIndex, sectorKey, data, isSelected, handleFareSelect, initiateBookFareHandler, handleClick, anchorRef, openFlightInfo, anchorEl, allLegs, handleCloseFlightInfo }) => {
    const baseFare = Number(faresGroupData?.price?.base_fare.replace(/,/g, '')) || 0;
    const tax = Number(faresGroupData?.price?.tax.replace(/,/g, '')) || 0;
    const grossAmount = Number(faresGroupData?.price?.gross_amount.replace(/,/g, '')) || 0;
    const totalFare = grossAmount;
    const formattedTotalFare = totalFare.toLocaleString();

    return (
        <div className='col-span-12 md:col-span-6 lg:col-span-4 border rounded-lg pb-4 bg-[#F5F6FF] mb-3'>
            <div className='px-4 py-2 bg-[#8A9DC2] rounded-tl-lg rounded-tr-lg'>
                <p className='font-bold text-white text-center rounded-lg text-md'>
                    {faresGroupData?.rbd}
                </p>
            </div>

            <div className='px-4 bg-[#F5F6FF]'>
                <div className=''>
                    <div className='mt-2'>
                        <div className='flex justify-between'>
                            <p className='text-sm text-gray-500'>Seat Selection</p>
                            <p className='text-sm'>not included</p>
                        </div>
                    </div>
                </div>

                <div className='mt-4'>
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <p className='text-sm text-gray-500'>Baggage</p>
                            <span className='text-xs'>{faresGroupData?.bagage_info} </span>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-sm text-gray-500'>Meal</p>
                            <p className='text-sm'>
                                {faresGroupData?.has_meal ? 'Included' : 'Excluded'}
                            </p>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-sm text-gray-500'>Cancellation</p>
                            <p
                                className={`text-xs px-2 rounded-full ${faresGroupData.is_refundable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {faresGroupData.is_refundable ? 'Refundable' : 'Non-Refundable'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='mt-4 flex flex-col items-end'>
                    <div className='flex items-center mb-2'>
                        <div className='relative'>
                            <IconButton
                                size='small'
                                onClick={handleClick}
                                ref={anchorRef}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                <InfoIcon fontSize='small' />
                            </IconButton>

                            <Popper
                                open={openFlightInfo}
                                anchorEl={anchorEl}
                                transition
                                placement='bottom-end'
                                className='!z-[9999]'
                                modifiers={[
                                    {
                                        name: 'preventOverflow',
                                        options: {
                                            altBoundary: true,
                                            padding: 8
                                        }
                                    },
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, 8]
                                        }
                                    }
                                ]}
                            >
                                {({ TransitionProps }) => (
                                    <Fade {...TransitionProps}>
                                        <Paper
                                            className='rounded-lg min-w-[200px]'
                                            sx={{
                                                zIndex: 9999,
                                                marginTop: '8px',
                                                position: 'relative',
                                                '&::before': {
                                                    content: '""',

                                                    width: 0,
                                                    height: 0,

                                                    zIndex: 9999
                                                }
                                            }}
                                        >
                                            <ClickAwayListener onClickAway={handleCloseFlightInfo}>
                                                <Box p={2}>
                                                    <Typography
                                                        variant='body2'
                                                        color='textSecondary'
                                                        gutterBottom
                                                    >
                                                        Price Detail
                                                    </Typography>
                                                    <Box display='flex' justifyContent='space-between' my={1}>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            Base Fare
                                                        </Typography>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            {faresGroupData?.price?.currency}{' '}
                                                            {faresGroupData?.price?.base_fare}
                                                        </Typography>
                                                    </Box>
                                                    <Box display='flex' justifyContent='space-between' my={1}>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            Tax
                                                        </Typography>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            {faresGroupData?.price?.currency}{' '}
                                                            {faresGroupData?.price?.tax}
                                                        </Typography>
                                                    </Box>
                                                    <Box display='flex' justifyContent='space-between' my={1}>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            Gross Fare
                                                        </Typography>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            {faresGroupData?.price?.currency}{' '}
                                                            {faresGroupData?.price?.gross_amount}
                                                        </Typography>
                                                    </Box>
                                                    <Divider sx={{ my: 1 }} />
                                                    <Box display='flex' justifyContent='space-between' mt={1}>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            Total
                                                        </Typography>
                                                        <Typography variant='body2' color='textSecondary'>
                                                            {faresGroupData?.price?.currency} {formattedTotalFare}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Fade>
                                )}
                            </Popper>
                        </div>
                    </div>
                    {data.provider === 'AIRBLUE_API' ? (
                        <Button
                            variant='contained'
                            className='w-full'
                            disabled={isSelected}
                            onClick={() => {
                                handleFareSelect(legIndex, {
                                    ...faresGroupData,
                                    sector: sectorKey,
                                    airline: data.airline,
                                }, data, data.legs);
                            }}
                        >
                            {isSelected ? 'Selected' : `${faresGroupData?.price?.currency} ${faresGroupData?.price?.gross_amount}`}
                        </Button>
                    ) : (
                        <Button
                            variant='contained'
                            className='w-full'
                            onClick={() => {
                                initiateBookFareHandler(faresGroupData?.booking_id)
                            }}
                        >
                            {faresGroupData?.price?.currency} {faresGroupData?.price?.gross_amount}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FareOptionCard
