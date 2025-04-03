"use client"

import MuiAutocomplete from '@/components/mui-form-inputs/MuiAutoComplete'
import MuiDatePicker from '@/components/mui-form-inputs/MuiDatePicker'
import MuiDateRangePicker from '@/components/mui-form-inputs/MuiDateRangePicker'
import { airportsNames, cabin_class } from '@/data/dropdowns/DropdownValues'
import { useLazyLocationsLookupQuery } from '@/redux-store/services/api'
import { Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { useRouter } from 'next/navigation'
import { Fragment, useCallback, useEffect, useState } from 'react'
import "react-google-flight-datepicker/dist/main.css"
import { Controller, useForm } from 'react-hook-form'
import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import TravelersDropdown from './TravelersDropdown'
import CryptoJS from "crypto-js";
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'

const FlightSearch = ({ initialValues, flightSearchOpen }) => {
  const [furnishingDetails, setFurnishingDetails] = useState(['Fridge', 'AC', 'TV'])
  const furnishingArray = [
    'AC',
    'TV',
    'RO',
    'Bed',
    'WiFi',
    'Sofa',
    'Fridge',
    'Cupboard',
    'Microwave',
    'Dining Table',
    'Washing Machine'
  ]
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const handleDateChange = (dates, event) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  // const CustomInput = forwardRef((props, ref) => {
  //   // Vars
  //   const startDate = props.start !== null ? formatDate(props.start, 'MM/dd/yyyy') : ''
  //   const endDate = props.end !== null ? ` - ${formatDate(props.end, 'MM/dd/yyyy')}` : null
  //   const value = `${startDate}${endDate !== null ? endDate : ''}`

  //   return <TextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  // })

  const router = useRouter();
  const [payloadValues, setPayloadValues] = useState('');
  const [fromSearchStr, setFromSearchStr] = useState(initialValues?.origin ?? "");
  const [toSearchStr, setToSearchStr] = useState(initialValues?.destination ?? "");
  const [legsFromSearchStrs, setLegsFromSearchStrs] = useState({});
  const [legsToSearchStrs, setLegsToSearchStrs] = useState({});
  const [loadingFields, setLoadingFields] = useState({});
  const [flightSearchCalenderIsOpen, setFlightSearchCalenderIsOpen] = useState(false);

  const today = dayjs();
  const [locationApiTrigger, { data: locationNames, isFetching, isSuccess }] = useLazyLocationsLookupQuery({});
  const { control, handleSubmit, setValue, watch, setError, clearErrors, reset, formState: { errors } } = useForm({
    defaultValues: initialValues || {
      traveler_count: {
        adult_count: 1,
        child_count: 0,
        infant_count: 0,
      },
      route_type: "ONEWAY",
      origin: null,
      destination: null,
      departure_date: dayjs().format("MM-DD-YYYY"),
      return_date: '',
      cabin_class: 'ECONOMY',
      traveler: '',
      legs: [
        { origin: "", destination: "", departure_date: "" },
        { origin: "", destination: "", departure_date: "" },
      ],
    },
  });


  const route_type = watch("route_type", "ONEWAY");

  const [flights, setFlights] = useState([
    {
      departure_date: "",
      destination: "",
      origin: ""
    },
    {
      departure_date: "",
      destination: "",
      origin: ""
    }
  ]);

  const fromDelayedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue) {
        setLoadingFields((prev) => ({ ...prev, origin: true }));
        locationApiTrigger({ query: searchValue }).finally(() => {
          setLoadingFields((prev) => ({ ...prev, origin: false }));
        });
      }
    }, 500),
    [locationApiTrigger]
  );

  const toDelayedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue) {
        setLoadingFields((prev) => ({ ...prev, destination: true }));
        locationApiTrigger({ query: searchValue }).finally(() => {
          setLoadingFields((prev) => ({ ...prev, destination: false }));
        });
      }
    }, 500),
    [locationApiTrigger]
  );
  const handleFromSearchChange = (_, newValue, reason) => {
    setFromSearchStr(newValue);
    if (reason === "input" && newValue.length >= 3) {
      fromDelayedSearch(newValue);
    }
  };

  const handleToSearchChange = (_, newValue, reason) => {
    setToSearchStr(newValue);
    if (reason === "input" && newValue.length >= 3) {
      toDelayedSearch(newValue);
    }
  };


  const legsFromDelayedSearch = useCallback(
    debounce((index, searchValue) => {
      if (searchValue) {
        setLoadingFields(prev => ({ ...prev, [`legsOrigin-${index}`]: true }));
        locationApiTrigger({ query: searchValue }).finally(() => {
          setLoadingFields(prev => ({ ...prev, [`legsOrigin-${index}`]: false }));
        });
      }
    }, 500),
    [locationApiTrigger]
  );

  const legsToDelayedSearch = useCallback(
    debounce((index, searchValue) => {
      if (searchValue) {
        setLoadingFields(prev => ({ ...prev, [`legsDestination-${index}`]: true }));
        locationApiTrigger({ query: searchValue }).finally(() => {
          setLoadingFields(prev => ({ ...prev, [`legsDestination-${index}`]: false }));
        });
      }
    }, 500),
    [locationApiTrigger]
  );
  const handleLegsFromSearchChange = (index, value, reason) => {
    setLegsFromSearchStrs((prev) => ({
      ...prev,
      [index]: value,
    }));
    if (reason === "input" && value.length >= 3) {
      legsFromDelayedSearch(index, value);
    }
  };

  const handleLegsToSearchChange = (index, value, reason) => {
    setLegsToSearchStrs((prev) => ({
      ...prev,
      [index]: value,
    }));
    if (reason === "input" && value.length >= 3) {
      legsToDelayedSearch(index, value);
    }
  };


  const swapLocations = () => {
    const origin = watch("origin");
    const destination = watch("destination");

    // Swap the values in the form
    setValue("origin", destination);
    setValue("destination", origin);

    // Swap the input search strings manually
    setFromSearchStr(toSearchStr);
    setToSearchStr(fromSearchStr);
  };
  const swapLegsLocations = (index) => {
    const currentOrigin = watch(`legs[${index}].origin`);
    const currentDestination = watch(`legs[${index}].destination`);

    // Swap the values in the form
    setValue(`legs[${index}].origin`, currentDestination);
    setValue(`legs[${index}].destination`, currentOrigin);

    // Swap the input search strings
    setLegsFromSearchStrs((prev) => ({
      ...prev,
      [index]: legsToSearchStrs[index] || "",
    }));
    setLegsToSearchStrs((prev) => ({
      ...prev,
      [index]: legsFromSearchStrs[index] || "",
    }));
  };

  const addFlight = () => {
    if (flights.length < 5) {
      const newFlight = { origin: "", destination: "", departure_date: "" };

      setFlights([...flights, newFlight]);
      setValue(`legs.${flights.length}`, newFlight); // Sync with form
    }
  };

  const removeFlight = (index) => {
    setFlights((prevFlights) => prevFlights.filter((_, i) => i !== index));

    // Ensure that watch("legs") is always an array before calling .filter()
    const legs = watch("legs") ?? []; // Use nullish coalescing to handle undefined cases

    setValue("legs", legs.filter((_, i) => i !== index));
  };

  useEffect(() => {
    clearErrors(); // Clears all errors when route_type changes
  }, [watch('route_type')]);

  const validateFlightData = (data, route_type) => {
    // if (!route_type) return "The route type field is required.";
    // if (!data.cabin_class) return "The cabin class field is required.";
    // if (!data.traveler_count?.adult_count) return "The Adult count field must be at least 1.";

    if (route_type === "MULTICITY") {
      if (!Array.isArray(data.legs) || data.legs.length < 2) {
        return "At least two flight legs are required.";
      }
      for (let index = 0; index < data.legs.length; index++) {
        const { origin, destination, departure_date } = data.legs[index];
        if (!origin) return `The origin field is required for Flight ${index + 1}`;
        if (!destination) return `The destination field is required for Flight ${index + 1}`;
        if (!departure_date) return `The departure date field is required for Flight ${index + 1}`;
      }
    } else {
      if (!data.origin) return "The origin field is required.";
      if (!data.destination) return "The destination field is required.";
      if (!data.departure_date) return "The departure date field is required.";
      if (route_type === "RETURN") {
        if (!data.return_date) return "The return date field is required.";
        if (new Date(data.return_date) < new Date(data.departure_date)) {
          return "The return date must be after the departure date.";
        }
      }
    }
    return null; // No errors
  };

  const onSubmit = async (data) => {
    const error = validateFlightData(data, route_type);
    if (error) {
      toast.error(error)
      return;
    }
    // Extract dates from `date_range`
    const departureDate = data.date_range?.start ? dayjs(data.date_range.start).format("YYYY-MM-DD") : null;
    const returnDate = data.date_range?.end ? dayjs(data.date_range.end).format("YYYY-MM-DD") : null;

    const payload = route_type === "MULTICITY"
      ? {
        cabin_class: data.cabin_class,
        route_type,
        legs: data.legs,
        traveler_count: data.traveler_count,
      }
      : {
        cabin_class: data.cabin_class,
        departure_date: route_type === "RETURN" ? departureDate : dayjs(data.departure_date).format("YYYY-MM-DD"),
        destination: data.destination,
        origin: data.origin,
        return_date: route_type === "RETURN" ? returnDate : null,
        route_type,
        traveler_count: data.traveler_count,
      };
    console.log('payload', payload);

    if (!payload) return;

    const { traveler_count, legs, ...restPayload } = payload;
    const serializedLegs = legs?.map((leg) => `${leg.origin},${leg.destination},${leg.departure_date}`).join(",");

    const queryString = new URLSearchParams(
      Object.entries({
        ...restPayload,
        ...(traveler_count
          ? {
            adult_count: traveler_count.adult_count,
            child_count: traveler_count.child_count,
            infant_count: traveler_count.infant_count,
          }
          : {}),
        ...(legs ? { legs: serializedLegs } : {}),
      })
        .filter(([_, value]) => value !== null && value !== undefined) // Remove null & undefined values
        .reduce((acc, [key, value]) => {
          acc[key] = String(value); // Convert all values to strings
          return acc;
        }, {}) // Initialize with an empty object
    ).toString();



    setPayloadValues(queryString);
    router.push(`flight/search/result/?${queryString}`);

    // if (flightSearchHandleClose) {
    //   flightSearchHandleClose();
    // }

    const SECRET_KEY = "my_random_secret_key_12345";
    // Function to encrypt data
    const encryptData = (data) => {
      return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    };

    // Function to decrypt data
    const decryptData = (ciphertext) => {
      try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData ? JSON.parse(decryptedData) : [];
      } catch (error) {
        console.error("Decryption error:", error);
        return [];
      }
    };

    // Save to local storage
    // let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    // Retrieve and decrypt recent searches
    let recentSearches = [];
    const storedData = localStorage.getItem("recentSearches");

    if (storedData) {
      recentSearches = decryptData(storedData);
    }

    // Remove searches with a past departure date
    const today = dayjs().format("YYYY-MM-DD");
    recentSearches = recentSearches.filter((search) => search.departure_date >= today);


    // Check if an entry with the same origin and destination already exists
    const existingIndex = recentSearches.findIndex(
      (search) => search.origin === payload.origin && search.destination === payload.destination
    );

    if (existingIndex !== -1) {
      // If an entry exists, update it
      recentSearches[existingIndex] = {
        ...recentSearches[existingIndex], // Keep existing data
        route_type: payload.route_type,
        departure_date: payload.departure_date,
        return_date: payload.return_date,
        traveler_count: payload.traveler_count,
        cabin_class: payload.cabin_class,
        legs: payload.legs,
      };
    } else {
      // If no entry exists, add a new one
      recentSearches.unshift({
        route_type: payload.route_type,
        origin: payload.origin,
        destination: payload.destination,
        departure_date: payload.departure_date,
        return_date: payload.return_date,
        traveler_count: payload.traveler_count,
        cabin_class: payload.cabin_class,
        legs: payload.legs,
      });

      // // Ensure only the last 4 searches are saved (optional)
      // if (recentSearches.length > 4) {
      //     recentSearches.pop(); // Remove the oldest search
      // }
    }

    // Save back to local storage
    // localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    localStorage.setItem("recentSearches", encryptData(recentSearches));

  };

  useEffect(() => {
    setValue("departure_date", dayjs().format("YYYY-MM-DD")); // Ensure default value is properly set
  }, [setValue]);
  useEffect(() => {
    setFlightSearchCalenderIsOpen(false);
  }, [route_type]);
  const travelTypes = ["ONEWAY", "RETURN", "MULTICITY"];

  return (
    <div>
      <Card className={`${flightSearchOpen ? 'border-0' : ' rounded-lg shadow-md mb-5'}`}>
        <CardContent className="p-6">
          {/* <h2 className="text-xl font-semibold">Search Flights</h2> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <Controller
                control={control}
                name="route_type"
                render={({ field }) => (
                  <FormControl>
                    <FormLabel id="travel-type-group-label">Travel Type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="travel-type-group-label"
                      name="route-type"
                      value={field.value}
                      // onChange={(event) => field.onChange(event.target.value)}
                      onChange={(event) => {
                        console.log("Selected Travel Type:", event.target.value);
                        field.onChange(event.target.value);
                      }}

                    >
                      {travelTypes.map((type) => (
                        <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
            {route_type !== "MULTICITY" ? (
              <div className="grid grid-cols-12 gap-6 items-end">
                <div className="relative col-span-12 md:col-span-6 lg:col-span-3 mb-5">
                  <MuiAutocomplete
                    control={control}
                    name="origin"
                    label="From"
                    placeholder="From"
                    selectIcon={<FaPlaneDeparture />}
                    options={[...(locationNames?.data || []), ...airportsNames].map((location) => ({
                      value: location.iata_code,
                      label: `${location.municipality} (${location.iata_code})`,
                      subLabel: location.name,
                      icon: <FaPlaneDeparture className='h-8 w-5' />
                    }))}
                    onInputChange={handleFromSearchChange}
                    inputValue={fromSearchStr}
                    setInputValue={setFromSearchStr}
                    loading={loadingFields.origin || false}
                  />
                  <div>
                    <button
                      onClick={swapLocations}
                      type="button"
                      className="absolute right-[-30px] bottom-2 p-2 border border-gray-300 rounded-full shadow z-10 cursor-pointer"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3 4 7l4 4" />
                        <path d="M4 7h16" />
                        <path d="m16 21 4-4-4-4" />
                        <path d="M20 17H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-5">
                  <MuiAutocomplete
                    control={control}
                    selectIcon={<FaPlaneArrival />}
                    name="destination"
                    label="To"
                    placeholder="To"
                    options={[...(locationNames?.data || []), ...airportsNames].map((location) => ({
                      value: location.iata_code,
                      label: `${location.municipality} (${location.iata_code})`,
                      subLabel: location.name,
                      icon: <FaPlaneArrival className='h-8 w-5' />
                    }))}
                    onInputChange={handleToSearchChange}
                    inputValue={toSearchStr}
                    setInputValue={setToSearchStr}
                    loading={loadingFields.destination || false}
                  />
                </div>
                <div className={`${route_type === "ONEWAY" ? 'lg:col-span-3' : 'lg:col-span-6'} col-span-12 md:col-span-6  mb-5`}>
                  {route_type === "ONEWAY" ?
                    <MuiDatePicker
                      control={control}
                      name={`departure_date`}
                      label="Departure Date"
                      className="w-full cursor-pointer"
                      minDate={dayjs()}
                      maxDate={dayjs().add(10, "year")}
                    />
                    :
                    <MuiDateRangePicker
                      control={control}
                      startName="departure_date"
                      endName="return_date"
                      startLabel="Departure Date"
                      endLabel="Return Date"
                      className="w-full"
                      minDate={dayjs()}
                      maxDate={dayjs().add(1, "year")}
                      disableEndDate={route_type === "ONEWAY"}
                    />
                  }
                </div>
                {route_type === "ONEWAY" &&
                  <div className="col-span-12 md:col-span-6 lg:col-span-3 mb-5">
                    <MuiDatePicker
                      control={control}
                      name={`return_date`}
                      label="Return Date"
                      className="w-full"
                      minDate={dayjs()}
                      maxDate={dayjs().add(10, "year")}
                      disabled={route_type === "ONEWAY"}
                    />
                  </div>
                }

                {/* {route_type === "ONEWAY" ?
                  <>
                    <div className={` lg:col-span-3 col-span-12 md:col-span-6  mb-5`}>
                      <Controller
                        control={control}
                        name="departure_date"
                        render={({ field }) => (
                          <div className="relative top-1">
                            <label className="text-sm text-start mb-0 absolute left-5 -top-1 z-10 bg-white px-1 ms-3">Departure Date</label>
                            <SingleDatePicker
                              startDate={field.value || new Date()}
                              onChange={(date) => {
                                if (date) {
                                  field.onChange(date); // ✅ Ensure `date` is passed correctly
                                  setFlightSearchCalenderIsOpen(false);
                                }
                              }}
                              minDate={dayjs()}
                              isOpen={flightSearchCalenderIsOpen}
                              onFocus={() => setFlightSearchCalenderIsOpen(true)}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className={` lg:col-span-3 col-span-12 md:col-span-6  mb-5`}>
                      <Controller
                        control={control}
                        name="return_date"
                        render={({ field }) => (
                          <div className="relative top-1">
                            <label className="text-sm text-start mb-0 absolute left-5 -top-1 z-10 bg-white px-1 ms-3">Return Date</label>
                            <SingleDatePicker
                              startDate={field.value || new Date()}
                              // onChange={(date) => field.onChange(date)}
                              disabled
                            />
                          </div>
                        )}
                      />
                    </div>
                  </>
                  :
                  <div className={`col-span-12 md:col-span-6 lg:col-span-6 mb-5`}>
                    <Controller
                      control={control}
                      name="date_range"
                      render={({ field }) => (
                        <div className="relative top-1">
                          <label className="text-sm text-start mb-0 absolute left-5 -top-1 z-10 bg-white px-1 ms-3">
                            Select Dates
                          </label>
                          <RangeDatePicker
                            startDate={field.value?.start || null}
                            endDate={field.value?.end || null}
                            minDate={dayjs()}
                            onChange={(start, end) => {
                              field.onChange({ start, end }); // Update form state
                              setValue("departure_date", dayjs(start).format("YYYY-MM-DD"));
                              setValue("return_date", dayjs(end).format("YYYY-MM-DD"));
                              if (start && end) {
                                setFlightSearchCalenderIsOpen(false);
                              }
                            }}
                            isOpen={flightSearchCalenderIsOpen}
                            onFocus={() => setFlightSearchCalenderIsOpen(true)}
                          />
                        </div>
                      )}
                    />

                  </div>
                } */}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
                  {flights.map((flight, index) => (
                    <Fragment key={index}>
                      <div className="col-span-12 lg:col-span-1">
                        <p className="text-blue-500">Flight {index + 1}</p>
                      </div>
                      <div className="relative col-span-12 md:col-span-4 lg:col-span-3  pt-[5px]">
                        <MuiAutocomplete
                          control={control}
                          // name={`origin`}
                          name={`legs[${index}].origin`}
                          label="From"
                          placeholder="From"
                          selectIcon={<FaPlaneDeparture />}
                          options={[...(locationNames?.data || []), ...airportsNames].map((location) => ({
                            value: location.iata_code,
                            label: `${location.municipality} (${location.iata_code})`,
                            subLabel: location.name,
                            icon: <FaPlaneDeparture className='h-8 w-5' />
                          }))}
                          onInputChange={(event, value, reason) => handleLegsFromSearchChange(index, value, reason)}
                          inputValue={legsFromSearchStrs[index] || ""}
                          setInputValue={(value) => handleLegsFromSearchChange(index, value)}
                          loading={loadingFields[`legsOrigin-${index}`] || false}
                        />
                        <div>
                          <button
                            onClick={() => swapLegsLocations(index)}
                            type="button"
                            className="absolute right-[-30px] bottom-2 p-2 border border-gray-300 rounded-full shadow z-10 cursor-pointer"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M8 3 4 7l4 4" />
                              <path d="M4 7h16" />
                              <path d="m16 21 4-4-4-4" />
                              <path d="M20 17H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-3 ">
                        <MuiAutocomplete
                          control={control}
                          selectIcon={<FaPlaneArrival />}
                          // name={`destination`}
                          name={`legs[${index}].destination`}
                          label="To"
                          placeholder="To"
                          options={[...(locationNames?.data || []), ...airportsNames].map((location) => ({
                            value: location.iata_code,
                            label: `${location.municipality} (${location.iata_code})`,
                            subLabel: location.name,
                            icon: <FaPlaneArrival className='h-8 w-5' />
                          }))}
                          onInputChange={(event, value, reason) => handleLegsToSearchChange(index, value, reason)}
                          inputValue={legsToSearchStrs[index] || ""}
                          setInputValue={(value) => handleLegsToSearchChange(index, value)}
                          // loading={loadingField === "legsDestination"}
                          loading={loadingFields[`legsDestination-${index}`] || false}
                        // onChange={(value: string | null) => handleMultiDestinationChange(index, value)}
                        // selectLabelInsteadOfValue={true}
                        />

                      </div>
                      <div className="col-span-12 md:col-span-4 lg:col-span-3">
                        <MuiDatePicker
                          control={control}
                          name={`legs[${index}].departure_date`}
                          label="Departure Date"
                          className="w-full"
                          minDate={index > 0 ? dayjs(watch(`legs[${index - 1}].departure_date`)).add(1, "day") : dayjs()}
                          maxDate={dayjs().add(1, "year")}
                        />
                        {/* <Controller
                          control={control}
                          name={`legs[${index}].departure_date`}
                          render={({ field }) => (
                            <div className="relative">
                              <label className="text-sm text-start mb-0 absolute left-5 -top-1 z-10 bg-white px-1 ms-3">Departure Date</label>
                              <SingleDatePicker
                                startDate={field.value}
                                onChange={(date) => {
                                  field.onChange(date);
                                  setFlightSearchCalenderIsOpen(false);
                                }}
                                minDate={index > 0 ? dayjs(watch(`legs[${index - 1}].departure_date`)).add(1, "day") : dayjs()}
                                maxDate={dayjs().add(1, "year")}
                                singleCalendar={true}
                                isOpen={flightSearchCalenderIsOpen}
                                onFocus={() => setFlightSearchCalenderIsOpen(true)}
                              />
                            </div>
                          )}
                        /> */}
                      </div>
                      <div className=" col-span-12 md:col-span-2">
                        {index >= 2 && (
                          <button
                            type="button"
                            onClick={() => removeFlight(index)}
                            className="text-red-500 hover:text-red-700 cursor-pointer pt-1 bg-transparent"
                          >
                            ✖ Remove
                          </button>
                        )}
                      </div>
                    </Fragment>
                  ))}
                </div>
                {flights.length < 5 &&
                  <div className="mt-4 mb-5">
                    <h4 onClick={addFlight} className="cursor-pointer text-blue-500 mt-2 underline">
                      + Add Another Flight
                    </h4>
                  </div>
                }
              </div>
            )}
            <div className={`grid grid-cols-12 gap-4 items-center ${flights.length === 5 ? 'mt-5' : ''}`}>
              <div className="col-span-12 md:col-span-6 lg:col-span-3 ">
                <TravelersDropdown control={control} name="traveler_count" />
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-3">
                <MuiDropdown
                  control={control}
                  name="cabin_class"
                  label="Cabin Class"
                  options={cabin_class?.map((cabin) => ({
                    value: cabin,
                    label: `${cabin}`,
                  }))}
                // onChange={handleCityChange}
                />
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-2">
                <Button type='submit' variant='contained' className="px-5 py-4 rounded" onClick={onSubmit}>
                  Search Flights
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FlightSearch
