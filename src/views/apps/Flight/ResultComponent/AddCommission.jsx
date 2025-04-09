'use client'

import { useEffect, useState } from 'react'

const AddCommission = ({ filteredFlights, setFilteredFlights }) => {
  const [amount, setAmount] = useState('')
  const [amountType, setAmountType] = useState('fixAmount')
  const [fareType, setFareType] = useState('grossfare')
  const [originalFlights, setOriginalFlights] = useState([]) // Untyped array

  // On initial render, store original fares
  useEffect(() => {
    if (originalFlights.length === 0 && filteredFlights.length > 0) {
      setOriginalFlights(JSON.parse(JSON.stringify(filteredFlights))) // Deep copy to avoid reference issues
    }
  }, [filteredFlights, originalFlights])

  const handleAmountTypeChange = e => {
    setAmountType(e.target.id)
  }

  const handleFareTypeChange = e => {
    setFareType(e.target.id)
  }

  const handleApply = () => {
    if (!amount) return // If input is empty, do nothing

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
            if (Number(amount) > 100) return fare // Prevent more than 100%

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
  }

  const handleClear = () => {
    setAmount('')
    setAmountType('fixAmount')
    setFilteredFlights(JSON.parse(JSON.stringify(originalFlights)))
  }

  return (
    <>
      {/* <Dropdown vertical="bottom" end className="z-50">
                <DropdownToggle button={false}>
                    <Button
                        color="primary"
                        variant="outline"
                        size="md"
                        className="font-bold text-sm xl:text-base cursor-pointer"
                    >
                        <FaPlus />
                        <span className="text-md">Add Commission</span>
                    </Button>
                </DropdownToggle>

                <DropdownMenu className="mt-4 shadow-lg rounded-lg w-72 z-50 focus:outline-none focus:ring-0">
                    <div>
                        <div className="mb-3">
                            <input
                                type="number"
                                className="w-full border-2 border-gray-300 rounded-lg ml-0 p-2"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    let val = e.target.value;
                                    if (amountType === "percentageAmount" && Number(val) > 100) return;
                                    setAmount(val);
                                }}
                            />
                        </div>

                        <div className="border-2 border-gray-300 rounded-lg ml-0">
                            <div className="text-gray-700 items-start border-b px-4 py-3">
                                <h1 className="font-semibold mb-4">Select Amount Type:</h1>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="radio"
                                        id="fixAmount"
                                        name="amountType"
                                        className="w-5 h-5 text-blue-600 border-gray-300"
                                        checked={amountType === "fixAmount"}
                                        onChange={handleAmountTypeChange}
                                    />
                                    <label htmlFor="fixAmount" className="text-gray-600 font-medium">Fix Amount</label>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="radio"
                                        id="percentageAmount"
                                        name="amountType"
                                        className="w-5 h-5 text-blue-600 border-gray-300"
                                        checked={amountType === "percentageAmount"}
                                        onChange={handleAmountTypeChange}
                                    />
                                    <label htmlFor="percentageAmount" className="text-gray-600 font-medium">Percentage Amount</label>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-gray-300 rounded-lg ml-0 mt-3">
                            <div className="text-gray-700 items-start border-b px-4 py-3">
                                <h1 className="font-semibold mb-4">Select Fare Type:</h1>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="radio"
                                        id="basefare"
                                        name="fareType"
                                        className="w-5 h-5 text-blue-600 border-gray-300"
                                        checked={fareType === "basefare"}
                                        onChange={handleFareTypeChange}
                                    />
                                    <label htmlFor="basefare" className="text-gray-600 font-medium">Base Fare</label>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="radio"
                                        id="grossfare"
                                        name="fareType"
                                        className="w-5 h-5 text-blue-600 border-gray-300"
                                        checked={fareType === "grossfare"}
                                        onChange={handleFareTypeChange}
                                    />
                                    <label htmlFor="grossfare" className="text-gray-600 font-medium">Gross Fare</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-3 justify-end">
                            <Button size="sm" onClick={handleClear}>Clear</Button>
                            <Button size="sm" color="primary" onClick={handleApply}>Apply</Button>
                        </div>
                    </div>
                </DropdownMenu>
            </Dropdown> */}
    </>
  )
}

export default AddCommission
