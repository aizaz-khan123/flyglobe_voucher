'use client'
import React, { useState } from 'react';
import {
    Box,
    Typography,

    Card,
    CardContent,
} from '@mui/material';

const GroupFlightBookings = () => {


    return (
        <Card>
            <CardContent>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 3fr)',
                    gap: 2
                }}>
                    <Typography variant="h5">
                        Fly3mach
                    </Typography>

                    <div>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Sector Information
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                            9P 764  06 May  150-BAN  19:35 21:15  20407-KG Baggage
                        </Typography>
                    </div>

                    <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dep Date</Typography>
                        <Typography variant="body2">6 May 2025</Typography>
                    </div>

                    <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Medi</Typography>
                        <Typography variant="body2">No</Typography>
                    </div>

                    <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Adult Price</Typography>
                        <Typography variant="body2">PKS 98,000</Typography>
                    </div>

                    <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Child</Typography>
                        <Typography variant="body2">97%</Typography>
                    </div>

                    <div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Infant</Typography>
                        <Typography variant="body2">Price On Car</Typography>
                    </div>
                </Box>
            </CardContent>
        </Card>





    );
};

export default GroupFlightBookings;
