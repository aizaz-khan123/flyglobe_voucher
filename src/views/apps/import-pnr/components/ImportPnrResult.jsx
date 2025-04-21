import { Card, CardContent, Table, TableBody, TableHead } from '@mui/material'
import React from 'react'

const FlightInformation = () => {
    return (
        <Card className='bg-white mt-5'>
            <CardContent>
                <h2 className='text-lg font-semibold'>Flight Information</h2>
                <div className='overflow-auto'>
                    <Table className="mt-2 rounded-box">
                        <TableHead>
                            <tr className="border-t border-gray-200 text-sm">
                                <th className="p-3">Flight</th>
                                <th className="p-3">Departure From</th>
                                <th className="p-3">Arrival To</th>
                                <th className="p-3">Depart At</th>
                                <th className="p-3">Arrive At</th>
                                <th className="p-3">Info</th>
                            </tr>
                        </TableHead>

                        <TableBody>
                            <>
                                <tr className="border-t border-gray-200 text-sm text-center">
                                    <td className="p-3">
                                        1
                                    </td>
                                    <td className="p-3">
                                        2
                                    </td>
                                    <td className="p-3">3</td>
                                    <td className="p-3">3</td>
                                    <td className="p-3">3</td>
                                </tr>

                            </>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
const PriceBreakDown = () => {
    return (
        <Card className='bg-white mt-5'>
            <CardContent>
                <h2 className='text-lg font-semibold'>Price BreakDown</h2>
                <div className='overflow-auto'>
                    <Table className="mt-2 rounded-box">
                        <TableHead>
                            <tr className="border-t border-gray-200 text-sm">
                                <th className="p-3">Flight</th>
                                <th className="p-3">Departure From</th>
                                <th className="p-3">Arrival To</th>
                                <th className="p-3">Depart At</th>
                                <th className="p-3">Arrive At</th>
                                <th className="p-3">Info</th>
                            </tr>
                        </TableHead>

                        <TableBody>
                            <>
                                <tr className="border-t border-gray-200 text-sm text-center">
                                    <td className="p-3">
                                        1
                                    </td>
                                    <td className="p-3">
                                        2
                                    </td>
                                    <td className="p-3">3</td>
                                    <td className="p-3">3</td>
                                    <td className="p-3">3</td>
                                </tr>

                            </>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
const PassengerInformation = () => {
    return (
        <Card className='bg-white mt-5'>
            <CardContent>
                <h2 className='text-lg font-semibold'>Passenger Information</h2>
                <div className='overflow-auto'>
                    <Table className="mt-2 rounded-box">
                        <TableHead>
                            <tr className="border-t border-gray-200 text-sm">
                                <th className="p-3">
                                    Passenger
                                </th>
                                <th className="p-3">
                                    Base Fare
                                </th>
                                <th className="p-3">
                                    Tax
                                </th>
                                <th className="p-3">
                                    Sub Total Fare
                                </th>
                                <th className="p-3">
                                    Baggage
                                </th>
                            </tr>
                        </TableHead>

                        <TableBody>
                            <>
                                <tr className="border-t border-gray-200 text-sm text-center">
                                    <td className="p-3">
                                        1
                                    </td>
                                    <td className="p-3">
                                        2
                                    </td>
                                    <td className="p-3">3</td>
                                    <td className="p-3">3</td>
                                    <td className="p-3">3</td>
                                </tr>

                            </>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

const ImportPnrResult = () => {
    return (
        <div className='grid grid-cols-1'>
            <FlightInformation />
            <PriceBreakDown />
            <PassengerInformation />
        </div>
    )
}

export default ImportPnrResult
