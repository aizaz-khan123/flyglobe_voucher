'use client'
import { useEffect, useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableHead,
  TableRow
} from '@mui/material'
import dayjs from 'dayjs'

import { FaDownload, FaTicket } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { RiRefund2Fill } from 'react-icons/ri'
import { TbBrandBooking, TbCancel } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { GiMeal } from 'react-icons/gi'

import { LiaBroadcastTowerSolid } from 'react-icons/lia'

import AgentTicketIssuanceModal from './AgentTicketIssuanceModal'
import BookingFlightDetail from './BookingFlightDetail'
import EmailTicketModal from './EmailTicketModal'
import ExpiryCountdown from './ExpiryCountdown'
import TicketIssuanceModal from './TicketIssuanceModal'
import VoidTicketModal from './VoidTicketModal'
import { stringHelper } from '@/utils/string'

import { formatCurrency } from '@/utils/currency'
import {
  useBookingByIdQuery,
  useBookingCancelMutation,
  useDownloadBookingMutation,
  useTicketOtpEmailMutation
} from '@/redux-store/services/api'

const BookingDetail = ({ bookingId }) => {
  const {
    data: booking,
    error,
    isLoading: isShowLoading,
    refetch
  } = useBookingByIdQuery(bookingId, {
    refetchOnMountOrArgChange: true
  })

  const [bookingCancel, { isLoading: isBookingCancelLoading }] = useBookingCancelMutation()
  const [downloadBooking, { isLoading: downloadLoading }] = useDownloadBookingMutation()
  const [ticketOptEmail, { isLoading: ticketOtpLoading }] = useTicketOtpEmailMutation()
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [isTktModalOpen, setIsTktModalOpen] = useState(false)
  const [isAgentTktModalOpen, setIsAgentTktModalOpen] = useState(false)
  const [isEmailTktOpen, setIsEmailTktOpen] = useState(false)
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false)
  const [emailType, setEmailType] = useState('')
  const user = useSelector(user => user?.auth?.userDetail)
  const email = user?.email
  const role = user?.role
  const setting = user?.setting

  useEffect(() => {
    refetch()
  }, [refetch])

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-red-500'>
        <p>Booking Not Found</p>
      </div>
    )
  }

  if (isShowLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <span className='loading loading-spinner loading-lg'></span>
        <p className='ml-2'>Loading Booking details...</p>
      </div>
    )
  }

  const {
    passengers,
    booking_pnr,
    pnr_expiry,
    airline,
    gross_fare,
    fare_break_down,
    booking_brand,
    status,
    booked_segments,
    baggage,
    issued_at
  } = booking


  const isPNRValid = !pnr_expiry || dayjs(pnr_expiry).isAfter(dayjs())
  const isConfirmed = status?.toLowerCase() === 'confirmed'
  const issuedAtTime = dayjs(issued_at)
  const isWithin24Hours = issuedAtTime.isAfter(dayjs().subtract(23, 'hours'))

  const handleCancelBooking = async () => {
    const bookingPnr = booking_pnr

    await bookingCancel({ bookingPnr }).then(response => {
      handleSetModalOpen()

      if ('error' in response) {
        toast.error('The booking cancellation does not meet the qualification criteria.')

        return
      }

      toast.success('Booking has been successfully cancelled')
      refetch()
    })
  }

  const refectBooking = () => {
    refetch()
  }

  const handleSetModalOpen = () => {
    setOpenCancelModal(!openCancelModal)
  }

  const handleIssueTicketModal = async () => {
    if (role === 'agency' || role === 'a-employee' || role === 'sub-agent') {
      if (!isAgentTktModalOpen) {
        await ticketOptEmail({}).then(response => {
          if ('error' in response) {
            return
          }

          toast.success(response?.data.message)
        })
      }

      setIsAgentTktModalOpen(!isAgentTktModalOpen)
    } else {
      setIsTktModalOpen(!isTktModalOpen)
    }
  }

  const handleDownloadTicket = async download_type => {
    const payload = { download_type: download_type, booking_id: bookingId }

    await downloadBooking(payload).then(response => {
      if ('error' in response) {
        toast.error('Something went wrong')

        return
      }

      window.open(response?.data, '_blank')
    })
  }

  const handleRefundTicket = () => { }

  const handleEmailTicketModal = () => {
    setEmailType('send_ticket_email')
    setIsEmailTktOpen(!isEmailTktOpen)
  }

  const handleEmailBookingModal = () => {
    setEmailType('send_booking_email')
    setIsEmailTktOpen(!isEmailTktOpen)
  }

  const handleVoidTicketModal = () => {
    setIsVoidModalOpen(!isVoidModalOpen)
  }

  return (
    <>
      <div className='grid grid-cols-12 gap-3'>
        <div className='col-span-12 md:col-span-9'>
          <div>
            {/* Booking Header */}
            <Card className='bg-base-100 mb-5'>
              <CardContent>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-gray-600'>Booking ID:</p>
                    <h2 className='text-lg font-semibold'>{bookingId}</h2>
                  </div>
                  <Button color='primary' className='text-base font-semibold cursor-default'>
                    {stringHelper.capitalizedWord(status)}
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* BookingFlightDetail */}
            <BookingFlightDetail bookingClass={booking_brand} booked_segments={booked_segments} airline={airline} />
            {/* Passenger Details */}
            <Card className='bg-base-100 mb-5'>
              <CardContent>
                <h2 className='font-semibold text-lg'>Passenger Details</h2>
                <div className='mt-1 space-y-1  max-w-full overflow-x-auto max-h-[400px] border rounded-lg'>
                  <Table className='min-w-max text-start'>
                    <TableHead className='bg-gray-200 text-start'>
                      <th className='text-sm font-semibold text-gray text-start p-3'>Passenger Name.</th>
                      <th className='text-sm font-semibold text-gray text-start p-3'>Date of Birth.</th>
                      <th className='text-sm font-semibold text-gray text-start p-3'>Document Type.</th>
                      <th className='text-sm font-semibold text-gray text-start p-3'>Document No.</th>
                      <th className='text-sm font-semibold text-gray text-start p-3'>Document Expiry</th>
                      <th className='text-sm font-semibold text-gray text-start p-3'>Passenger Type</th>
                      <th className='text-sm font-semibold text-gray text-start p-3'>Ticket Number</th>
                    </TableHead>

                    <TableBody hasData={true}>
                      {passengers?.map((passenger, index) => (
                        <tr key={index} className='hover:bg-base-200/40 text-base font-semibold text-gray-800 border-b'>
                          <td className='p-3'>
                            {passenger?.title}. {passenger?.first_name} {passenger?.last_name}
                          </td>
                          <td className='p-3'>{passenger?.date_of_birth}</td>
                          <td className='p-3'>
                            {passenger?.d_type === 'P'
                              ? 'Passport'
                              : passenger?.d_type === 'I'
                                ? 'CNIC'
                                : passenger?.d_type}
                          </td>
                          <td className='p-3'>{passenger?.d_number}</td>
                          <td className='p-3'>{passenger?.d_expiry}</td>
                          <td className='p-3'>{stringHelper.passengerType(passenger?.passenger_type)}</td>
                          <td className='p-3'>{passenger?.ticket_number || 'N/A'}</td>
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card className='bg-base-100 mb-5'>
              <CardContent>
                <h2 className='font-semibold text-lg'>Additional Services on 1st Flight</h2>
                <div className='mt-1 space-y-2'>
                  <div className='border flex gap-2 items-center p-2 rounded max-w-80'>
                    <GiMeal fontSize={30} className='text-primary' />
                    <p className='text-gray-800 text-base font-semibold'>Meal Included</p>
                  </div>
                  {/* {baggage &&
                    Object.entries(baggage as BaggageData).map(([passengerType, baggageItems]) => (

                      <div key={passengerType} className="border flex gap-2 items-center p-2 rounded max-w-80">
                        <img src="/media/icons/baggage-icon.svg" alt="img" />
                        <p className="text-gray-800 text-base font-semibold">
                          {passengerType}:{" "}
                          {baggageItems.map((item, index) => (
                            <span key={item.id}>
                              {item.weight ? `${item.weight}${item.unit?.toUpperCase() || "KG"}` : ""}
                              {item.pieceCount ? ` (${item.pieceCount} pc)` : ""}
                              {index !== baggageItems.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      </div>
                    ))} */}
                  {/* {baggage?.map(([passengerType, baggageItems]) => {
                                        let checkedBaggage = "";
                                        let cabinBaggage = "";

                                        baggageItems?.forEach((item) => {
                                            if (item.provisionType === "A") {
                                                checkedBaggage = `Checked Baggage: ${passengerType}, ${item.weight ?? 25}kg`;
                                            } else if (item.provisionType === "B") {
                                                cabinBaggage = `Cabin Baggage: ${passengerType}, ${item.pieceCount ?? 1}x${item.weight ?? 7}kg`;
                                            }
                                        });

                                        return (
                                            <div key={passengerType} className="border flex flex-col gap-2 p-2 rounded max-w-80">
                                                {checkedBaggage && (
                                                    <div className="flex gap-2 items-center">
                                                        <img src="/media/icons/baggage-icon.svg" alt="Checked Baggage Icon" />
                                                        <p className="text-gray-800 text-base font-semibold">{checkedBaggage}</p>
                                                    </div>
                                                )}
                                                {cabinBaggage && (
                                                    <div className="flex gap-2 items-center">
                                                        <img src="/media/icons/baggage-icon.svg" alt="Cabin Baggage Icon" />
                                                        <p className="text-gray-800 text-base font-semibold">{cabinBaggage}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })} */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className='col-span-12 md:col-span-3'>
          <Card className='bg-base-100 mb-5'>
            <CardContent>
              <div className='text-center flex justify-center items-center flex-col'>
                <p className='text-lg font-semibold text-gray-800'>
                  PNR: <span>{booking_pnr}</span>
                </p>
                {pnr_expiry === null ? (
                  <p className='text-center font-medium'>Upcoming PNR Expiry time</p>
                ) : (
                  <ExpiryCountdown pnrExpiry={pnr_expiry} bookingStatus={status} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card className='bg-base-100 mb-5'>
            {/* <p className="text-center text-red-500 font-medium">Note: Please ensure that the ticket is issued<br></br> on the same day. The company will not be responsible for any price changes if the ticket is issued on a later date.</p> */}
            <CardContent>
              <h2 className='font-semibold text-lg'>Pricing Summary</h2>
              {Object.entries(fare_break_down || {}).map(([key, data], index) => {
                const passengerType = key === 'ADT' ? 'Adult' : key === 'CNN' ? 'Child' : key === 'INF' ? 'Infant' : key
                // Safe access whether prices are nested or at root
                const prices = data?.prices || data;
                return (
                  <div key={index} className='flex justify-between border-b pb-2'>
                    <p className='font-semibold'>
                      {airline?.iata_code} ({passengerType}) x {data?.quantity}:
                    </p>
                    <p className='text-gray-400'>
                      {prices?.currency} {prices?.gross_amount ?? prices?.gross_fare}
                    </p>
                  </div>
                )
              })}

              <div className='flex justify-between mt-4 border-b pb-2'>
                <h4 className='font-semibold'>Price you Pay:</h4>
                <h4 className='text-primary font-bold'>{formatCurrency(gross_fare)}</h4>
              </div>

              <Accordion
                className='p-0 shadow-none before:hidden border-0'
                disableGutters
              // sx={{ boxShadow: "none", "&:before": { display: "none" } }}
              >
                <AccordionSummary
                  expandIcon={
                    <div className='bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center'>
                      <ExpandMoreIcon />
                    </div>
                  }
                  className='text-lg font-bold !px-0'
                >
                  <h1 className='text-lg font-bold'>Fare Breakdown</h1>
                </AccordionSummary>

                <AccordionDetails className='!p-0'>
                  <div className='space-y-5'>
                    {Object.entries(fare_break_down || {}).map(([key, data], index) => {
                      const passengerType =
                        key === 'ADT' ? 'Adult' : key === 'CNN' ? 'Child' : key === 'INF' ? 'Infant' : key
                      const prices = data?.prices || data;
                      return (
                        <div key={index} className='border p-2 rounded-md'>
                          <h2 className='font-semibold text-lg py-3'>{passengerType}</h2>
                          <hr className='mb-2 mt-0' />
                          <div>
                            <div className='flex justify-between items-center mb-1'>
                              <p className='text-gray-800 text-sm font-semibold'>Base Fare:</p>
                              <p className='text-gray text-sm font-semibold text-end'>
                                {prices?.currency} {prices?.base_fare}
                              </p>
                            </div>
                            <div className='flex justify-between items-center mb-1'>
                              <p className='text-gray-800 text-sm font-semibold'>Tax:</p>
                              <p className='text-gray text-sm font-semibold text-end'>
                                {prices?.currency} {prices?.tax}
                              </p>
                            </div>
                            <div className='flex justify-between items-center mb-1'>
                              <p className='text-gray-800 text-sm font-semibold'>Gross Fare:</p>
                              <p className='text-gray text-sm font-semibold text-end'>
                                {prices?.currency} {prices?.gross_amount ?? prices?.gross_fare}
                              </p>
                            </div>
                            <hr className='border mt-3' />
                            <div className='flex justify-between mt-4'>
                              <h4 className='font-semibold text-lg'>Total to Pay:</h4>
                              <h4 className='text-primary font-bold text-lg'>
                                {prices?.currency} {prices?.gross_amount ?? prices?.gross_fare}
                              </h4>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </AccordionDetails>
              </Accordion>
              {status == 'cancelled' && <h3 className='font-bold text-2xl text-primary'> Booking Canceled</h3>}
              {status == 'voided' && <h3 className='font-bold text-2xl text-primary'> Booking Voided</h3>}
              {status == 'refunded' && <h3 className='font-bold text-2xl text-primary'> Booking Refunded</h3>}
              {status == 'expired' && <h3 className='font-bold text-2xl text-primary'> Booking Expired</h3>}
              {isConfirmed && (
                <div className='flex justify-center flex-col space-y-4 mt-4'>
                  {isPNRValid && (
                    <>
                      {(role === 'head-office' ||
                        role === 'h-employee' ||
                        role === 'branch' ||
                        role === 'branch-employee' ||
                        ((role === 'agency' || role === 'a-employee' || role === 'sub-agent') &&
                          setting?.can_issue_ticket))
                        && (
                          <Button
                            variant='contained'
                            startIcon={<FaTicket />}
                            onClick={handleIssueTicketModal}
                            disabled={ticketOtpLoading}
                            loading={ticketOtpLoading}
                          >
                            {'Issue Ticket'}
                          </Button>
                        )}

                      <Button
                        variant='contained'
                        startIcon={<TbCancel className='text-2xl' />}
                        onClick={handleSetModalOpen}
                      >
                        Cancel Booking
                      </Button>
                    </>
                  )}

                  <Button
                    variant='contained'
                    startIcon={<TbBrandBooking className='text-2xl' />}
                    onClick={handleEmailBookingModal}
                  >
                    Email Booking
                  </Button>
                  <Button
                    variant='contained'
                    startIcon={<FaDownload />}
                    onClick={() => handleDownloadTicket('booking_download')}
                    disabled={downloadLoading}
                    loading={downloadLoading}
                  >
                    Download Booking
                  </Button>
                </div>
              )}

              {status == 'issued' && (
                <div className='flex justify-center flex-col space-y-4 mt-4'>
                  <Button
                    variant='contained'
                    startIcon={<FaDownload />}
                    onClick={() => handleDownloadTicket('ticket_download')}
                    disabled={downloadLoading}
                    loading={downloadLoading}
                  >
                    Download Ticket
                  </Button>
                  {isWithin24Hours ? (
                    <Button
                      variant='contained'
                      startIcon={<FaTicket />}
                      onClick={() => setIsVoidModalOpen(!isVoidModalOpen)}
                    >
                      Void Ticket
                    </Button>
                  ) : (
                    <Button variant='contained' startIcon={<RiRefund2Fill />} onClick={handleRefundTicket}>
                      Refund Ticket
                    </Button>
                  )}
                  <Button variant='contained' startIcon={<FaTicket />} onClick={handleEmailTicketModal}>
                    {' '}
                    Email Ticket
                  </Button>
                </div>
              )}

              <div className='flex justify-center mt-4'>
                {/* <img src="/media/images/study-abroad.svg" alt="img" /> */}
                <LiaBroadcastTowerSolid className='text-primary' fontSize={200} />
              </div>
            </CardContent>
          </Card>

          <Dialog open={openCancelModal}>
            <DialogTitle className='flex justify-between items-center'>
              <h3 className='font-bold'>Confirm Cancel Booking</h3>
              <IoMdClose onClick={handleSetModalOpen} className='cursor-pointer' />
            </DialogTitle>
            <DialogContent>
              You are about to cancel this Booking <b>{booking_pnr}</b>. Would you like to proceed further ?
            </DialogContent>
            <DialogActions>
              <form method='dialog'>
                <Button color='error' disabled={isBookingCancelLoading} size='sm' onClick={handleSetModalOpen}>
                  No
                </Button>
              </form>
              <form method='dialog'>
                <Button
                  loading={isBookingCancelLoading}
                  disabled={isBookingCancelLoading}
                  color='primary'
                  size='sm'
                  onClick={() => handleCancelBooking()}
                >
                  Yes
                </Button>
              </form>
            </DialogActions>
          </Dialog>

          <AgentTicketIssuanceModal
            isModalOpen={isAgentTktModalOpen}
            handleIssueTicketModal={handleIssueTicketModal}
            bookingPnr={booking_pnr}
            refectBooking={refectBooking}
          />
          <TicketIssuanceModal
            isModalOpen={isTktModalOpen}
            handleIssueTicketModal={handleIssueTicketModal}
            bookingPnr={booking_pnr}
            refectBooking={refectBooking}
          />
          <VoidTicketModal
            isModalOpen={isVoidModalOpen}
            passengers={passengers}
            handleVoidTicketModal={handleVoidTicketModal}
            bookingPnr={booking_pnr}
            refectBooking={refectBooking}
          />

          <EmailTicketModal
            isModalOpen={isEmailTktOpen}
            handleEmailTicketModal={handleEmailTicketModal}
            userEmail={email}
            bookingId={bookingId}
            type={emailType}
          />
        </div>
        <div id='ticket-download-topdf' style={{ position: 'absolute', left: '-9999px' }}>
          {/* <Ticket
            pnrNumber={booking_pnr}
            airline={airline}
            bookingDate={issued_at}
            bookingStatus={status}
            flightSegments={booked_segments}
            passengers={passengers}
            fareBreakdown={fare_break_down}
          /> */}
        </div>
      </div>
    </>
  )
}

export default BookingDetail
