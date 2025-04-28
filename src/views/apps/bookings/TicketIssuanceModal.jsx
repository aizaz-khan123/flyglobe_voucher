'use client'

import { useState } from 'react'

import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, IconButton, Select, Typography } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

import { useBranchDropDownQuery, useDropDownByTypeQuery, useTicketOtpEmailMutation } from '@/redux-store/services/api'
import BookingOTP from './BookingOTP'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'

const TicketIssuanceModal = ({ isModalOpen, handleIssueTicketModal, bookingPnr, refectBooking }) => {
  const [issueFor, setIssueFor] = useState('') // track the user's choice (self or others)
  const [branch, setBranch] = useState('') // branch selection
  const [roleType, setRoleType] = useState('agencies')
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [showOTP, setShowOTP] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [step, setStep] = useState(1)

  const { data: typeDropDown } = useDropDownByTypeQuery({ roleType })

  // const
  const { data: branchesDropDown } = useBranchDropDownQuery()

  const [ticketOptEmail, { isLoading: ticketOtpLoading }] = useTicketOtpEmailMutation()

  const handleIssueForChange = value => {
    setIssueFor(value)
  }

  const handleBranchChange = event => {
    setBranch(event.target.value)
  }

  const handleRoleTypeChange = async value => {
    setRoleType(value)
    setStep(1)
  }

  const handleSelfProceed = async () => {
    await ticketOptEmail({}).then(response => {
      if ('error' in response) {
        return
      }

      toast.success(response?.data.message)

      if (issueFor === 'self') {
        setShowOTP(true)
      } else if (issueFor === 'others') {
        setShowOTP(true)
      }

      setStep(2)
    })
  }

  return (
    <Dialog open={isModalOpen} fullWidth maxWidth="md">
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h5">Ticket Issuance Confirmation</Typography>
        <IconButton onClick={handleIssueTicketModal} size="small">
          <IoMdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Card className='bg-base-100 mt-5'>
          <CardContent className='gap-0'>
            {step === 1 && (
              <div className='flex flex-col gap-5 items-center'>
                <h3 className='mb-5 text-lg font-medium'>
                  Are you issuing a ticket for yourself or for others?
                </h3>
                <ul className='grid w-full gap-6 md:grid-cols-2'>
                  <li>
                    <input
                      type='radio'
                      id='hosting-small'
                      name='hosting'
                      value='self'
                      className='hidden peer'
                      required
                      onChange={() => {
                        setIssueFor('self')
                      }}
                    />
                    <label
                      htmlFor='hosting-small'
                      className='inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'
                    >
                      <div className='block'>
                        <div className='w-full text-lg font-semibold'>Issue for Myself</div>
                      </div>
                      <svg
                        className='w-5 h-5 ms-3 rtl:rotate-180'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 14 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M1 5h12m0 0L9 1m4 4L9 9'
                        />
                      </svg>
                    </label>
                  </li>
                  <li>
                    <input
                      type='radio'
                      id='hosting-big'
                      name='hosting'
                      value='others'
                      className='hidden peer'
                      onChange={() => {
                        setIssueFor('others')
                        setStep(1)
                      }}
                    />
                    <label
                      htmlFor='hosting-big'
                      className='inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'
                    >
                      <div className='block'>
                        <div className='w-full text-lg font-semibold'>Issue for Others</div>
                      </div>
                      <svg
                        className='w-5 h-5 ms-3 rtl:rotate-180'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 14 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M1 5h12m0 0L9 1m4 4L9 9'
                        />
                      </svg>
                    </label>
                  </li>
                </ul>
              </div>
            )}

            {step === 1 && issueFor === 'others' && (
              <div>
                <select
                  value={branch}
                  onChange={(e) => {
                    handleBranchChange(e);
                    setStep(1);
                  }}
                  className="w-full  bg-slate-200 p-4 text-black mt-5"
                >
                  <option value="" disabled>
                    Select Branch
                  </option>
                  {branchesDropDown.map((value, index) => (
                    <option key={index} value={value?.id}>
                      {value?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {step === 1 && branch && issueFor === 'others' && (
              <>
                <div className='flex flex-col'>
                  <p className='text-base font-normal mt-3 mb-2 text-gray-900 dark:text-white'>
                    Is this for an Agency or an Employee?
                  </p>
                  <ul className='grid w-full gap-6 md:grid-cols-2'>
                    <li>
                      <input
                        type='radio'
                        id='agency'
                        name='roleType'
                        value='agency'
                        className='hidden peer'
                        checked={roleType === 'agencies'}
                        onChange={() => handleRoleTypeChange('agencies')}
                      />
                      <label
                        htmlFor='agency'
                        className='inline-flex items-center justify-between p-5 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer 
                          dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 
                          dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 
                          dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'
                      >
                        <div className='block'>
                          <div className='w-full text-lg font-semibold'>Agency</div>
                        </div>
                        <svg
                          className='w-5 h-5 ms-3 rtl:rotate-180'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 14 10'
                        >
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M1 5h12m0 0L9 1m4 4L9 9'
                          />
                        </svg>
                      </label>
                    </li>

                    <li>
                      <input
                        type='radio'
                        id='employee'
                        name='roleType'
                        value='employee'
                        className='hidden peer'
                        checked={roleType === 'employees'}
                        onChange={() => handleRoleTypeChange('employees')}
                      />
                      <label
                        htmlFor='employee'
                        className='inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer 
                          dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 
                          dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 
                          dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'
                      >
                        <div className='block'>
                          <div className='w-full text-lg font-semibold'>Employee</div>
                        </div>
                        <svg
                          className='w-5 h-5 ms-3 rtl:rotate-180'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 14 10'
                        >
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M1 5h12m0 0L9 1m4 4L9 9'
                          />
                        </svg>
                      </label>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {step === 1 && roleType && issueFor === 'others' && (
              <div>
                {roleType === 'agencies' && (
                  <div>
                    <select
                      value={selectedAgency}
                      onChange={(e) => {
                        setSelectedAgency(e.target.value);
                        setStep(1);
                      }}
                      className="w-full form-select bg-slate-200 p-4 text-black mt-5"
                    >
                      <option value="" disabled>Select Agency</option>
                      {typeDropDown.data.length > 0 &&
                        typeDropDown.data.map((value, index) => (
                          <option key={index} value={value?.id}>
                            {value?.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )}

                {roleType === 'employees' && issueFor === 'others' && (
                  <div>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => {
                        setSelectedEmployee(e.target.value);
                        setStep(1);
                      }}
                      className="w-full bg-slate-200 p-4 text-black mt-5"
                    >
                      <option value="" disabled>Select Employee</option>
                      {typeDropDown.data.length > 0 &&
                        typeDropDown.data.map((value, index) => (
                          <option key={index} value={value?.id}>
                            {value?.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* {step === 2 && roleType && (selectedAgency || selectedEmployee) && ( */}
            {step === 2 && (
              <div className='flex justify-center flex-col items-center w-full mt-5'>
                <div className='flex justify-center flex-col items-center w-full mt-5'>
                  <h2 className='text-2xl font-semibold text-center text-base-content/80 mb-4'>Enter OTP</h2>
                  <p className='text-center text-sm text-base-content/60 mb-6'>
                    We&apos;ve sent a one-time OTP to your registered email address.
                  </p>
                </div>
                <BookingOTP
                  bookingId={bookingPnr}
                  refectBooking={refectBooking}
                  handleIssueTicketModal={handleIssueTicketModal}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <div className='flex justify-between w-full'>
          {step > 1 && (
            <Button color='primary' className='float-right' size='md' onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}

          {step === 1 && issueFor === 'self' && (
            <div className='flex justify-end w-full'>
              <Button
                color='primary'
                size='md'
                onClick={handleSelfProceed}
                loading={ticketOtpLoading}
                disabled={ticketOtpLoading}
              >
                Proceed
              </Button>
            </div>
          )}

          {step === 1 && issueFor === 'others' && (selectedAgency || selectedEmployee) && (
            <div className='flex justify-end w-full'>
              <Button
                color='primary'
                size='md'

                // onClick={() => {
                //   setStep(2);
                //   handleSelfProceed()
                // }}
                onClick={handleSelfProceed}
                loading={ticketOtpLoading}
                disabled={ticketOtpLoading}
              >
                Proceed
              </Button>
            </div>
          )}
          {/* {(selectedAgency || selectedEmployee) && (
            <Button color="primary" size="md" onClick={handleSubmit}>
              Proceed
            </Button>
          )} */}
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default TicketIssuanceModal
