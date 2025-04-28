import { Typography, Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";

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

  if (["issued", "voided", "refunded", "cancelled"].includes(bookingStatus)) {
    return null;
  }

  if (timeLeft.expired) {
    return (
      <Typography textAlign="center" color="error" fontWeight="medium">
        Expired
      </Typography>
    );
  }

  return (
    <Grid container spacing={2} justifyContent="center" mt={3}>
      {timeLeft.days > 0 && (
        <Grid item>
          <Box textAlign="center">
            <Typography variant="h4">{timeLeft.days}</Typography>
            <Typography variant="body2">days</Typography>
          </Box>
        </Grid>
      )}
      <Grid item>
        <Box textAlign="center">
          <Typography variant="h4">{timeLeft.hours}</Typography>
          <Typography variant="body2">hours</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Box textAlign="center">
          <Typography variant="h4">{timeLeft.minutes}</Typography>
          <Typography variant="body2">min</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Box textAlign="center">
          <Typography variant="h4">{timeLeft.seconds}</Typography>
          <Typography variant="body2">sec</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ExpiryCountdown;
