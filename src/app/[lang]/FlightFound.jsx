useEffect(() => {
  if (!mergeFlightResponse) return;

  const filtered = mergeFlightResponse.filter(flight => {
    // Normalize legs to handle both PIA and Airblue structures
    const normalizedLegs = Array.isArray(flight?.legs)
      ? Array.isArray(flight?.legs[0])
        ? flight?.legs.flat() // Airblue: Flatten nested arrays
        : flight?.legs // PIA: Use as-is
      : Object.values(flight?.legs || {}).flat(); // Handle Airblue object structure

    const stops = normalizedLegs?.[0]?.segments?.length ? normalizedLegs[0].segments.length - 1 : 0;

    const departureTime = normalizedLegs?.[0]?.segments?.[0]?.departure_datetime || '';

    // Normalize fare_option to handle both array and object structures
    const fareOptions = Array.isArray(flight?.fare_option)
      ? flight?.fare_option
      : Object.values(flight?.fare_option || {});

    const hasMatchingFare = (() => {
      // Define price check function
      const checkFare = fare => {
        const priceStr = fare?.price?.gross_amount || '0';
        const price = parseFloat(priceStr.replace(/,/g, ''));
        return price >= priceRange.value[0] && price <= priceRange.value[1];
      };

      // PIA flights
      if (flight.provider === 'PIA_HITIT' || flight.provider === 'SABRE') {
        return flight.fare_option?.some(checkFare);
      }

      // Airblue flights
      if (flight.provider === 'AIRBLUE_API') {
        // Check leg-based fares
        if (flight.legs) {
          return Object.values(flight.legs).some(legGroup => legGroup.some(leg => leg.fare_option?.some(checkFare)));
        }
        return false;
      }

      return false;
    })();

    // Updated airline matching logic
    const matchesAirline = (() => {
      const selectedAirline = Object.values(selectedAirlinesBySector || {}).find(airline => airline);
      return selectedAirline ? flight.airline.name === selectedAirline : true;
    })();

    const matchesStops = selectedStops.length === 0 || selectedStops.includes(stops);
    const matchesAirlines = selectedAirlines.length === 0 || matchesAirline;
    const matchesDepartureTime =
      selectedDepartureTimes.length === 0 ||
      selectedDepartureTimes.some(timeRange => isWithinTimeRange(departureTime, timeRange));

    return matchesStops && matchesAirlines && matchesDepartureTime && hasMatchingFare;
  });

  setFilteredFlights(filtered || []);
}, [selectedStops, selectedAirlines, selectedDepartureTimes, priceRange.value, selectedAirlinesBySector]);