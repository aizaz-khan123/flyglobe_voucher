'use client'

import DateTimeComp from "@/components/date/DateTimeComp";
import Image from "next/image";
import StatusWidget from "./StatusWidget";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, Pagination, Table, TableBody, TableHead, TableRow } from "@mui/material";
import { FaDownload } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import MuiTextField from "@/components/mui-form-inputs/MuiTextField";
import MuiAutocomplete from "@/components/mui-form-inputs/MuiAutoComplete";
import Link from "@/components/Link";
// import TailwindDateRangePicker from "@/components/tailwind/TailwindDateRangePicker";
import { useBookingListQuery } from "@/redux-store/services/api";
import MuiDatePicker from "@/components/mui-form-inputs/MuiDatePicker";
import { useForm } from "react-hook-form";
import { MdExpandMore } from "react-icons/md";
import SearchInput from "../../../components/searchInput/SearchInput";

const BookingRow = ({ booking }) => {
    const {
        booking_id,
        booking_pnr,
        status,
        provider_name,
        departure_date_time,
        booking_brand,
        airline,
        created_at,
        is_refundable,
        passengers,
        booked_by_user,
        organization
    } = booking;
    const currentDate = dayjs();

    return (
        <>
            <TableRow className="hover:bg-base-200/40 text-sm whitespace-nowrap ">
                <Link
                    href={routes.apps.flight.booking_detail(booking_id)}
                    aria-label={"Edit product link"}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <div className="font-medium text-blue-600">{booking_id}</div>
                </Link>
                <div className="flex items-center space-x-3 truncate">
                    <div className="font-medium">{booking_pnr}</div>
                </div>
                {/* <div className="font-medium">{airline?.iata_code}</div> 
        */}
                <div className="flex items-center space-x3">
                    <Image src={airline?.thumbnail} height={30} width={30} className="size-10 rounded-box" alt="Product Image" />
                    <div>
                        <div className="font-medium">{airline?.iata_code}</div>
                    </div>

                </div>
                <div className="font-medium">{<StatusWidget status={status} />}</div>

                <div className="font-medium">
                    <DateTimeComp formattedDate={created_at} />{" "}
                </div>
                <div className="font-medium">
                    <DateTimeComp formattedDate={departure_date_time} />
                </div>

                {/* <div className="font-medium text-center">
          {status == "confirmed" ? (
            dayjs(pnr_expiry).isBefore(currentDate) ? (
              <span className="text-red-700">Expired</span>
            ) : (
              "-"
            )
          ) : (
            "-"
          )}
        </div> */}
                <div className="font-medium">{provider_name}</div>
                <div className="font-medium">{organization?.name}</div>
                <div className="font-medium">{booked_by_user?.name}</div>
                <div className="font-medium text-center">
                    {is_refundable === 1 ? (
                        <span className="text-success">YES</span>
                    ) : (
                        <span className="text-red-700">NO</span>
                    )}
                </div>
                <div className="font-medium cursor-pointer">
                    <Dropdown className="cursor-pointer" vertical="bottom" end>
                        <DropdownToggle className="" button={false}>
                            <div className="flex items-center text-base cursor-pointer">Travelers <IoIosArrowDown className="ms-5" /></div>
                        </DropdownToggle>

                        <DropdownMenu className="mt-4 bg-white border shadow-lg rounded-lg w-72">
                            {passengers?.map((passenger, index) => (
                                <DropdownItem
                                    anchor={false}
                                    className="hover:bg-gray-100 focus:bg-gray-100 active:bg-transparent"
                                >
                                    <span>
                                        {passenger?.title} {passenger?.first_name} {passenger?.last_name}
                                    </span>
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {/* <div className="font-medium">{supplier?.name}</div> */}

                {/* <div className="font-medium">{booked_by_user?.email || "admin@gmail.com"}</div> */}
                <div className="flex justify-center items-center">
                    <Button
                        variant="contained"
                    >
                        <FaDownload />
                    </Button>
                </div>
            </TableRow>
        </>
    );
};


const BookingTable = ({ hidePagination }) => {

    const [searchText, setSearchText] = useState("");
    const [pageUrl, setPageUrl] = useState("");
    const [filters, setFilters] = useState({
        booking_id: "",
        pnr: "",
        email: "",
        status: "",
        from: "",
        to: "",
    });

    const { data: detail_data, refetch, isFetching } = useBookingListQuery({
        searchText,
        pageUrl,
        ...filters,
    });
    const bookings = detail_data?.data;
    const links = detail_data?.links;
    const contentRef = useRef(null);
    const [isSecondOpen, setIsSecondOpen] = useState(false);

    const { control: filterControl } = useForm({
        defaultValues: {
            category: "default",
            search: "",
        },
    });

    const { control, handleSubmit, reset } = useForm({
        defaultValues: filters,
    });


    const applyFilters = (data) => {
        setFilters({
            booking_id: data.booking_id || "",
            pnr: data.pnr || "",
            email: data.email || "",
            status: data.status || "",
            from: data.from ? new Date(data.from).toISOString().split("T")[0] : "",
            to: data.to ? new Date(data.to).toISOString().split("T")[0] : "",
        });

        setTimeout(() => {
            refetch();
        }, 0);
    };

    const clearFilters = () => {
        reset();
        setFilters({
            booking_id: "",
            pnr: "",
            email: "",
            status: "",
            from: "",
            to: "",
        });

        setTimeout(() => {
            refetch();
        }, 0);
    };

    const paginationClickHandler = (url) => {
        if (url) {
            setPageUrl(url);
        }
    };

    const [status, setStatus] = useState("");

    const orderStatuses = [
        { value: "expired", label: "Expired" },
        { value: "confirmed", label: "Confirmed" },
        { value: "issued", label: "Issued" },
        { value: "voided", label: "Voided" },
        { value: "refunded", label: "Refunded" },
        { value: "cancelled", label: "Cancelled" },
    ];

    useEffect(() => {
        refetch();
    }, [filters, searchText, pageUrl]);


    return (
        <>
            <Card className="mt-5 bg-base-100">
                <CardContent className={"p-0"}>
                    <div className="flex items-center justify-between px-5 pt-5">
                        {!hidePagination &&
                            <Accordion className="w-full">
                                <AccordionSummary
                                    expandIcon={<MdExpandMore />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <p className="font-bold text-xl ">Filters</p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className="flex items-center mr-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">

                                            <MuiTextField
                                                className="h-[3.2rem] w-full border-0 focus:outline-0"
                                                control={control}
                                                size="md"
                                                id="booking_id"
                                                name="booking_id"
                                                placeholder="Enter Booking ID"
                                            />

                                            <MuiTextField
                                                className="h-[3.2rem] w-full border-0 focus:outline-0"
                                                control={control}
                                                size="md"
                                                id="pnr"
                                                name="pnr"
                                                placeholder="Enter PNR"
                                            />


                                            <MuiTextField
                                                className="h-[3.2rem] w-full border-0 focus:outline-0"
                                                control={control}
                                                size="md"
                                                id="email"
                                                name="email"
                                                placeholder="Enter Email"
                                            />

                                            <MuiAutocomplete
                                                control={control}
                                                name="status"
                                                label="Status"
                                                placeholder="Select Order Status"
                                                options={orderStatuses}
                                                onInputChange={(_, newValue) => setStatus(newValue)}
                                                inputValue={status}
                                                setInputValue={setStatus}
                                                loading={false}
                                                className="w-full"
                                            />
                                            <MuiDatePicker
                                                control={control}
                                                name="from"
                                                label="Booking From"
                                                className="w-full"
                                            />

                                            <MuiDatePicker
                                                control={control}
                                                name="to"
                                                label="Booking to"
                                                className="w-full"
                                            />
                                            {/* <TailwindDateRangePicker
                                                control={control}
                                                startName="from"
                                                endName="to"
                                                onChange={(startDate, endDate) => {
                                                    console.log("Selected Range:", startDate, endDate);
                                                }}
                                            /> */}
                                            <div className="flex gap-1 items-center">
                                                <Button
                                                    variant="contained"
                                                    className="text-sm"
                                                    onClick={handleSubmit(applyFilters)}
                                                >
                                                    Search
                                                </Button>{" "}

                                                <Button
                                                    variant="contained"
                                                    className=""
                                                    onClick={clearFilters}
                                                >
                                                    Clear All
                                                </Button>
                                            </div>
                                        </div>


                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        }
                    </div>
                    <div className="px-5 mt-8">
                        <SearchInput onSearch={setSearchText} control={filterControl} />
                    </div>

                    <div className="overflow-auto">
                        <Table className="mt-2 rounded-box">
                            <TableHead>
                                <span className="text-sm font-medium text-base-content/80">
                                    Booking ID
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    PNR
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Airline
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Booking Status
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Booking Date
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Travel Date
                                </span>
                                {/* <span className="text-sm font-medium text-base-content/80">
                  Status Remarks
                </span> */}
                                <span className="text-sm font-medium text-base-content/80">
                                    Connector
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Branch
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Agent
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Refundable
                                </span>
                                <span className="text-sm font-medium text-base-content/80">
                                    Travelers
                                </span>
                                {/* <span className="text-sm font-medium text-base-content/80">
                  Supplier
                </span> */}

                                <span className="text-sm font-medium text-base-content/80">
                                    Download Ticket
                                </span>
                            </TableHead>

                            <TableBody isLoading={isFetching} hasData={!!bookings?.length}>
                                {bookings?.map((booking, index) => (
                                    <BookingRow booking={booking} key={index} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {!hidePagination ?
                        <div className={`flex items-center justify-end px-5 pb-5 pt-3`}>
                            <Pagination pagination={links} clickHandler={paginationClickHandler} />
                        </div>
                        :
                        <Link href="/bookings" className="text-center text-blue-600 text-base font-semibold pb-4">
                            See More
                        </Link>
                    }

                </CardContent>
            </Card>
        </>
    );
};

export default BookingTable;
