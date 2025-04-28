"use client";

import {
    Card,
    CardContent,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AirbluePricingSummary = ({ bookingAvailabilityConfirmationData }) => {
    return (
        <Box>
            <Card sx={{ mb: 5 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Price Summary
                    </Typography>
                    {Object.entries(bookingAvailabilityConfirmationData?.price?.fare_break_down || {}).map(([key, data], index) => (
                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1, mb: 1 }}>
                            <Typography fontWeight="600">
                                {'PA'} ({key}) x {data?.quantity}:
                            </Typography>
                            <Typography color="text.secondary">
                                {data?.currency} {data?.gross_fare}
                            </Typography>
                        </Box>
                    ))}

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                        <Typography fontWeight="600">Price you Pay:</Typography>
                        <Typography fontWeight="bold" sx={{ color: "primary.main" }}>
                            {bookingAvailabilityConfirmationData?.price.currency} {bookingAvailabilityConfirmationData?.price.gross_amount}
                        </Typography>
                    </Box>

                    <Accordion
                        disableGutters
                        elevation={0}
                        sx={{
                            mt: 2,
                            "&:before": { display: "none" },
                            backgroundColor: "background.paper",
                        }}
                        className="border-0"
                    >
                        <AccordionSummary
                            expandIcon={
                                <Box
                                    sx={{
                                        backgroundColor: "primary.main",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: 32,
                                        height: 32,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ExpandMoreIcon />
                                </Box>
                            }
                            sx={{ px: 0 }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Fare Breakdown
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ px: 0 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {Object.entries(bookingAvailabilityConfirmationData?.price?.fare_break_down || {}).map(([key, data], index) => (
                                    <Box key={index} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                                            {key}
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography fontWeight="600" variant="body2">Base Fare:</Typography>
                                            <Typography fontWeight="600" variant="body2">{data?.currency} {data?.base_fare}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography fontWeight="600" variant="body2">Tax:</Typography>
                                            <Typography fontWeight="600" variant="body2">{data?.currency} {data?.tax}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography fontWeight="600" variant="body2">Gross Fare:</Typography>
                                            <Typography fontWeight="600" variant="body2">{data?.currency} {data?.gross_fare}</Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body1" fontWeight="600">Total to Pay:</Typography>
                                            <Typography variant="body1" fontWeight="bold" sx={{ color: "primary.main" }}>
                                                {data?.currency} {data?.gross_fare}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AirbluePricingSummary;
