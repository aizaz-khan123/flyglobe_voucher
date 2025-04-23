'use client'
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

import FlightsTab from './components/FlightsTab';
import GroupFlightTab from './components/GroupFlightTab';
import UmrahVouchersTab from './components/UmrahVouchersTab';
import UmrahHotelsTab from './components/UmrahHotelsTab';

const SellBookings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={activeTab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        <Tab label="Flights" />
        <Tab label="Group Flights" />
        <Tab label="Umrah Vouchers" />
        <Tab label="Umrah Hotels" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <FlightsTab />}
        {activeTab === 1 && <GroupFlightTab />}
        {activeTab === 2 && <UmrahVouchersTab />}
        {activeTab === 3 && <UmrahHotelsTab />}
      </Box>
    </Box>
  );
};

export default SellBookings;
