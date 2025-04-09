import Link from 'next/link'

import { Badge, Button } from '@mui/material'
import { FaPencil, FaTrash } from 'react-icons/fa6'

export const AirlineMarginRow = ({
  airline_margin,
  showDeleteAirlineMarginConfirmation,
  showAssignAirlineMarginConfirmation
}) => {
  const { id, uuid, sales_channel, airline, region, margin, margin_type, rbds, is_apply_on_gross, status, remarks } =
    airline_margin

  return (
    <>
      <tr className='hover:bg-base-200/40'>
        {/* ID Column */}
        <td className='font-medium'>{id}</td>

        {/* Sales Channel Column */}
        <td className='flex items-center space-x-3 truncate'>{sales_channel}</td>

        {/* Airline Column */}
        <td className='flex items-center space-x-3 truncate'>{airline?.name}</td>

        {/* Pricing Column */}
        <td className='text-sm font-medium'>
          {Number(margin) > 0 ? (
            <Badge color='warning'>
              {margin}
              {margin_type === 'amount' ? 'PKR' : '%'}
            </Badge>
          ) : (
            <Badge color='success'>
              {margin}
              {margin_type === 'amount' ? 'PKR' : '%'}
            </Badge>
          )}
        </td>

        {/* Region Column */}
        <td className='font-medium'>{region}</td>

        {/* Apply on Gross Fare Column */}
        <td className='font-medium'>
          {is_apply_on_gross ? <Badge color='success'>Yes</Badge> : <Badge color='warning'>No</Badge>}
        </td>

        {/* Status Column */}
        <td className='font-medium w-[8rem]'>
          {status ? (
            <Badge color='success' outline>
              Active
            </Badge>
          ) : (
            <Badge color='warning' outline>
              In-Active
            </Badge>
          )}
        </td>

        {/* Rbds Column */}
        <td className='font-medium'>{rbds}</td>

        {/* Remarks Column */}
        <td className='text-sm'>{remarks?.length > 20 ? `${remarks.slice(0, 20)}...` : remarks}</td>

        {/* Action Column */}
        <td className='inline-flex w-fit'>
          <Link
            href={`/settings/airline-margins/${uuid}/edit`}
            aria-label='Edit airline margin'
            onClick={event => event.stopPropagation()}
          >
            <Button color='ghost' size='sm' shape='square' aria-label='Edit airline margin'>
              <FaPencil className='text-base-content/70' fontSize={20} />
            </Button>
          </Link>
          <Button
            color='ghost'
            className='text-error/70 hover:bg-error/20'
            size='sm'
            shape='square'
            onClick={event => {
              event.stopPropagation()
              showDeleteAirlineMarginConfirmation(uuid)
            }}
          >
            <FaTrash fontSize={22} />
          </Button>
          <Button
            color='ghost'
            className='text-error/70 hover:bg-error/20'
            size='sm'
            shape='square'
            onClick={event => {
              event.stopPropagation()
              showAssignAirlineMarginConfirmation(margin, margin_type)
            }}
          >
            {/* <Icon icon={assignIcon} fontSize={22} /> */}
          </Button>
        </td>
      </tr>
    </>
  )
}
