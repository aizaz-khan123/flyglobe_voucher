'use client'

import { useEffect, useState, useRef } from 'react'

import { Button, ClickAwayListener, Fade, Paper, Popper } from '@mui/material'
import { FaPlus } from 'react-icons/fa6'

const AddCommission = ({ filteredFlights, setFilteredFlights }) => {
  const [amount, setAmount] = useState('')
  const [amountType, setAmountType] = useState('fixAmount')
  const [fareType, setFareType] = useState('grossfare')
  const [originalFlights, setOriginalFlights] = useState([])
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  // On initial render, store original fares
  useEffect(() => {
    if (originalFlights.length === 0 && filteredFlights.length > 0) {
      setOriginalFlights(JSON.parse(JSON.stringify(filteredFlights)))
    }
  }, [filteredFlights, originalFlights])

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const handleAmountTypeChange = e => {
    setAmountType(e.target.id)
  }

  const handleFareTypeChange = e => {
    setFareType(e.target.id)
  }

  const handleApply = () => {
    if (!amount) return
    let updatedFlights = filteredFlights.map((flight, flightIndex) => {
      return {
        ...flight,
        fare_option: flight.fare_option.map((fare, fareIndex) => {
          let originalBaseFare = Number(
            originalFlights[flightIndex]?.fare_option?.[fareIndex]?.price?.base_fare.replace(/,/g, '') || 0
          )
          let originalGrossAmount = Number(
            originalFlights[flightIndex]?.fare_option?.[fareIndex]?.price?.gross_amount.replace(/,/g, '') || 0
          )

          let newBaseFare = originalBaseFare
          let newGrossAmount = originalGrossAmount

          if (amountType === 'fixAmount') {
            if (fareType === 'basefare') {
              newBaseFare = originalBaseFare + Number(amount)
            } else {
              newGrossAmount = originalGrossAmount + Number(amount)
            }
          } else if (amountType === 'percentageAmount') {
            if (Number(amount) > 100) return fare

            if (fareType === 'basefare') {
              newBaseFare = originalBaseFare + (originalBaseFare * Number(amount)) / 100
            } else {
              newGrossAmount = originalGrossAmount + (originalGrossAmount * Number(amount)) / 100
            }
          }

          return {
            ...fare,
            price: {
              ...fare.price,
              base_fare: newBaseFare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              gross_amount: newGrossAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            }
          }
        })
      }
    })

    setFilteredFlights(updatedFlights)
    setOpen(false)
  }

  const handleClear = () => {
    setAmount('')
    setAmountType('fixAmount')
    setFilteredFlights(JSON.parse(JSON.stringify(originalFlights)))
    setOpen(false)
  }

  return (
    <>
      <div className='relative'>
        <Button
          ref={anchorRef}
          variant='outlined'
          size='md'
          className='font-bold text-sm xl:text-base cursor-pointer'
          onClick={handleToggle}
        >
          <FaPlus />
          <span className='text-md'>Add Commission</span>
        </Button>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          transition
          placement='bottom-end'
          className='!z-[9999]' // High z-index to ensure it stays on top
          modifiers={[
            {
              name: 'preventOverflow',
              options: {
                altBoundary: true,
                padding: 8
              }
            }
          ]}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper
                className='shadow-lg rounded-lg w-72'
                sx={{
                  zIndex: 9999,
                  marginTop: '8px',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-8px',
                    right: '14px',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #fff',
                    filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.1))',
                    zIndex: 9999
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <div className='p-4 focus:outline-none focus:ring-0'>
                    {/* Keep all your existing form content here */}
                    <div className='mb-3'>
                      <input
                        type='number'
                        className='w-full border-2 border-gray-300 rounded-lg ml-0 p-2'
                        placeholder='0.00'
                        value={amount}
                        onChange={e => {
                          let val = e.target.value

                          if (amountType === 'percentageAmount' && Number(val) > 100) return
                          setAmount(val)
                        }}
                      />
                    </div>

                    <div className='border-2 border-gray-300 rounded-lg ml-0'>
                      <div className='text-gray-700 items-start border-b px-4 py-3'>
                        <h4 className='font-semibold mb-4'>Select Amount Type:</h4>
                        <div className='flex items-center gap-2 mb-2'>
                          <input
                            type='radio'
                            id='fixAmount'
                            name='amountType'
                            className='w-5 h-5 text-primary border-gray-300'
                            checked={amountType === 'fixAmount'}
                            onChange={handleAmountTypeChange}
                          />
                          <label htmlFor='fixAmount' className='text-gray-600 font-medium'>
                            Fix Amount
                          </label>
                        </div>

                        <div className='flex items-center gap-2 mt-2'>
                          <input
                            type='radio'
                            id='percentageAmount'
                            name='amountType'
                            className='w-5 h-5 text-primary border-gray-300'
                            checked={amountType === 'percentageAmount'}
                            onChange={handleAmountTypeChange}
                          />
                          <label htmlFor='percentageAmount' className='text-gray-600 font-medium'>
                            Percentage Amount
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className='border-2 border-gray-300 rounded-lg ml-0 mt-3'>
                      <div className='text-gray-700 items-start border-b px-4 py-3'>
                        <h4 className='font-semibold mb-4'>Select Fare Type:</h4>
                        <div className='flex items-center gap-2 mb-2'>
                          <input
                            type='radio'
                            id='basefare'
                            name='fareType'
                            className='w-5 h-5 text-primary border-gray-300'
                            checked={fareType === 'basefare'}
                            onChange={handleFareTypeChange}
                          />
                          <label htmlFor='basefare' className='text-gray-600 font-medium'>
                            Base Fare
                          </label>
                        </div>

                        <div className='flex items-center gap-2 mt-2'>
                          <input
                            type='radio'
                            id='grossfare'
                            name='fareType'
                            className='w-5 h-5 text-primary border-gray-300'
                            checked={fareType === 'grossfare'}
                            onChange={handleFareTypeChange}
                          />
                          <label htmlFor='grossfare' className='text-gray-600 font-medium'>
                            Gross Fare
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className='flex gap-3 mt-3 justify-end'>
                      <Button size='small' variant='outlined' onClick={handleClear}>
                        Clear
                      </Button>
                      <Button size='small' variant='contained' onClick={handleApply}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    </>
  )
}

export default AddCommission
