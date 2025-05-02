'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

import { useDepositsOrgListQuery } from '@/redux-store/services/api'
import AcceptDepositeModal from './AcceptDepositeModal'
import RejectDepositeModal from './RejectDepositeModal'
import { numberHelper } from '../../refund-request/numberHelpers'

const AgencyDeposit = () => {
  const [searchText, setSearchText] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [acceptDepositeModal, setAcceptDepositeModal] = useState(false)
  const [rejectDepositeModal, setRejectDepositeModal] = useState(false)
  const [depositeUUID, setDepositeUUID] = useState(null)

  const {
    data: detail_data,
    isFetching,
    refetch: RefundRequestRefetch
  } = useDepositsOrgListQuery({ searchText, pageUrl })

  const agencyDepositeDetails = detail_data?.data || []
  const links = detail_data?.links

  useEffect(() => {
    RefundRequestRefetch()
  }, [])

  const columns = useMemo(
    () => [
      {
        header: 'Bank Name',
        accessorKey: 'bank.bank_name',
        cell: ({ row }) => row.original.bank?.bank_name || '-'
      },
      {
        header: 'Deposit Amount',
        accessorKey: 'deposit_amount',
        cell: ({ getValue }) => numberHelper.formatAmountWithCommas(getValue())
      },
      {
        header: 'Request By',
        accessorKey: 'request_by.name',
        cell: ({ row }) => row.original.request_by?.name || '-'
      },
      {
        header: 'Approved By',
        accessorKey: 'approved_by.name',
        cell: ({ row }) => row.original.approved_by?.name || '-'
      },
      {
        header: 'Status',
        accessorKey: 'status'
      },
      {
        header: 'Receipt',
        accessorKey: 'reciept',
        cell: ({ row }) => <img src={row.original.reciept} alt='Receipt' width={50} height={50} />
      },
      {
        header: 'Action',
        id: 'actions',
        cell: ({ row }) => (
          <Box display='flex' gap={1}>
            <Button
              variant='contained'
              color='error'
              size='small'
              onClick={() => {
                setDepositeUUID(row.original.uuid)
                setRejectDepositeModal(true)
              }}
            >
              Reject
            </Button>
            <Button
              variant='contained'
              color='success'
              size='small'
              onClick={() => {
                setDepositeUUID(row.original.uuid)
                setAcceptDepositeModal(true)
              }}
            >
              Accept
            </Button>
          </Box>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: agencyDepositeDetails,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <div className='overflow-x-auto p-5'>
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className='text-left p-3 border-b'>
                        {header.isPlaceholder ? null : (
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={table.getAllColumns().length}>
                      <Box display='flex' justifyContent='center' py={3}>
                        <CircularProgress />
                      </Box>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className='p-3 border-b'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={table.getAllColumns().length}>
                      <Box display='flex' justifyContent='center' py={3}>
                        <Typography>No data found.</Typography>
                      </Box>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AcceptDepositeModal
        isOpen={acceptDepositeModal}
        handleAcceptDepositeModal={() => setAcceptDepositeModal(false)}
        RefundRequestRefetch={RefundRequestRefetch}
        depositeUUID={depositeUUID}
      />
      <RejectDepositeModal
        isOpen={rejectDepositeModal}
        handleRejectDepositeModal={() => setRejectDepositeModal(false)}
        RefundRequestRefetch={RefundRequestRefetch}
        depositeUUID={depositeUUID}
      />
    </>
  )
}

export default AgencyDeposit
