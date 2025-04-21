"use client";

import {
    Box, Button, Card, CardContent, CircularProgress, IconButton, Menu, MenuItem, Pagination, Tooltip, Typography
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import StatusRefund from "@/components/booking/StatusRefund";
import { useEffect, useMemo, useState } from "react";
import AcceptRefundModal from "./AcceptRefundModal";
import RejectRefundModal from "./RejectRefundModal";
import DateTimeComp from "@/components/date/DateTimeComp";
import FareRuleModal from "./FareRuleModal";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import {
    ColumnDef, flexRender, getCoreRowModel, useReactTable
} from "@tanstack/react-table";
import { useRefundRequestQuery } from "@/redux-store/services/api";
import OptionMenu from "@/@core/components/option-menu";


//helper function to format the date

const generateRandomIntegerAround = (valu, maxVariation) => {
    return Math.floor(Math.random() * maxVariation * 2 + 1) + (value - maxVariation);
};
const formatAmountWithCommas = (amount) => {
    if (typeof amount !== 'number') return '0';
    return amount.toLocaleString();
};


export const numberHelper = {
    generateRandomIntegerAround,
    formatAmountWithCommas,
};

//helper end

const RefundRequestTable = () => {
    const [searchText, setSearchText] = useState("");
    const [pageUrl, setPageUrl] = useState("");
    const [booking, setBooking] = useState(null);
    const [acceptRefundModalOpen, setAcceptRefundModalOpen] = useState(false);
    const [rejectRefundModalOpen, setRejectRefundModalOpen] = useState(false);
    const [fareRuleModalOpen, setFareRuleModalOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState({});

    const { data: detail_data, isFetching, refetch: RefundRequestRefetch } = useRefundRequestQuery({ searchText, pageUrl });
    const myRefundDetail = detail_data?.data;
    const links = detail_data?.links;

    useEffect(() => {
        RefundRequestRefetch();
    }, []);

    const columns = useMemo(
        () => [
            {
                header: "Booking ID",
                accessorKey: "booking.booking_id",
                cell: ({ row }) => (
                    <Typography component="a" sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                        {row.original.booking.booking_id}
                    </Typography>
                )
            },
            {
                header: "PNR",
                accessorKey: "booking.booking_pnr"
            },
            {
                header: "Request Status",
                accessorKey: "status",
                cell: ({ getValue }) => <StatusRefund status={getValue()} />
            },
            {
                header: "Booking By",
                accessorKey: "booking.booked_by_user.name"
            },
            {
                header: "Request By",
                accessorKey: "requested_by.name"
            },
            {
                header: "Booked At",
                accessorKey: "booking.created_at",
                cell: ({ getValue }) => <DateTimeComp formattedDate={getValue()} />
            },
            {
                header: "Requested DateTime",
                accessorKey: "created_at",
                cell: ({ getValue }) => <DateTimeComp formattedDate={getValue()} />
            },
            {
                header: "Airline",
                accessorKey: "booking.airline.name"
            },
            {
                header: "Supplier",
                accessorKey: "booking.supplier.name"
            },
            {
                header: "Base Fare",
                accessorKey: "base_fare",
                cell: ({ getValue }) => numberHelper.formatAmountWithCommas(getValue())
            },
            {
                header: "Tax",
                accessorKey: "tax",
                cell: ({ getValue }) => numberHelper.formatAmountWithCommas(getValue())
            },
            {
                header: "Total Amount",
                accessorKey: "total_amount",
                cell: ({ getValue }) => numberHelper.formatAmountWithCommas(getValue())
            },
            {
                header: "Refunded Amount",
                accessorKey: "refunded_amount",
                cell: ({ getValue }) => getValue() || "N/A"
            },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => (
                    <div className='flex items-center w-fit gap-2'>

                        <Tooltip title='Settings' placement='top'>
                            <OptionMenu
                                iconClassName='text-textPrimary'
                                options={[
                                    {
                                        text: 'View Fare Rule',
                                        menuItemProps: {
                                            onClick: (event) => {
                                                event.stopPropagation();
                                                setBooking(row.original.booking);
                                                setFareRuleModalOpen(true);
                                            }
                                        }
                                    },
                                    {
                                        text: 'Accept',
                                        menuItemProps: {
                                            onClick: (event) => {
                                                event.stopPropagation();
                                                setBooking(row.original.booking);
                                                setAcceptRefundModalOpen(true);
                                            }
                                        }
                                    },
                                    {
                                        text: 'Reject',
                                        menuItemProps: {
                                            onClick: (event) => {
                                                event.stopPropagation();
                                                setBooking(row.original.booking);
                                                setRejectRefundModalOpen(true);
                                                
                                            }
                                        }
                                    },
                                ]}
                            />
                        </Tooltip>
                    </div>
                )
            }

        ],
        [menuAnchor]
    );

    const table = useReactTable({
        data: myRefundDetail || [],
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <>
            <Card sx={{ mt: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    <div className='overflow-x-auto p-5'>
                        <table className='w-full border-collapse'>
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className='bg-gray-100 whitespace-nowrap'>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className='text-left p-3 border-b'>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.length ? table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className='p-3 border-b'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={table.getAllColumns().length}>
                                            <div className='flex justify-center items-center py-5'>
                                                <CircularProgress />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                        <Pagination pagination={links} clickHandler={(url) => url && setPageUrl(url)} />
                    </Box>
                </CardContent>
            </Card>

            <AcceptRefundModal
                isOpen={acceptRefundModalOpen}
                handleAcceptRefundTicket={() => setAcceptRefundModalOpen(false)}
                booking={booking}
                RefundRequestRefetch={RefundRequestRefetch}
            />

            <RejectRefundModal
                isOpen={rejectRefundModalOpen}
                handleRejectRefundTicket={() => setRejectRefundModalOpen(false)}
                booking={booking}
                RefundRequestRefetch={RefundRequestRefetch}
            />

            <FareRuleModal
                isOpen={fareRuleModalOpen}
                handleFareRuleModal={() => setFareRuleModalOpen(false)}
                booking={booking}
            />
        </>
    );
};

export { RefundRequestTable };
