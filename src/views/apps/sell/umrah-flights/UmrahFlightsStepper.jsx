
'use client'

import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'


import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'


import FlightInformation from './UmrahFlightsComponents/FlightInformation'
import ShirkaServices from './UmrahFlightsComponents/ShirkaServices'
import MautamerInformation from './UmrahFlightsComponents/MautamerInformation'
import Transportation from './UmrahFlightsComponents/Transportation'
import PackageDetails from './UmrahFlightsComponents/PackageDetails'
import Ziyaraat from './UmrahFlightsComponents/Ziyaraat'
import Remarks from './UmrahFlightsComponents/Remarks'

// Vars
const steps = [
  {
    title: 'Flight Information',
    subtitle: 'In Progress',
    status: 'inProgress'
  },
  {
    title: 'Shirka and Services',
    subtitle: 'Complete',
    status: 'complete'
  },
  {
    title: "Mautamer's Info",
    subtitle: 'Complete',
    status: 'complete'
  },
  {
    title: 'Transportation',
    subtitle: 'Complete',
    status: 'complete'
  },
  {
    title: 'Package Details',
    subtitle: 'Complete',
    status: 'complete'
  },
  {
    title: 'Ziyaraat',
    subtitle: 'Complete',
    status: 'complete'
  },
  {
    title: 'Remarks',
    subtitle: 'Complete',
    status: 'complete'
  }
]

// Styled Components
const ConnectorHeight = styled(StepConnector)(() => ({
  '& .MuiStepConnector-line': {
    minHeight: 20
  }
}))

const getStepContent = (step, handleNext, handlePrev) => {
  switch (step) {
    case 0:
      return <FlightInformation handleNext={handleNext} handlePrev={handlePrev} />
    case 1:
      return <ShirkaServices handleNext={handleNext} handlePrev={handlePrev} />
    case 2:
      return <MautamerInformation handleNext={handleNext} handlePrev={handlePrev} />
    case 3:
      return <Transportation handleNext={handleNext} handlePrev={handlePrev} />
    case 4:
      return <PackageDetails handleNext={handleNext} handlePrev={handlePrev} />
    case 5:
      return <Ziyaraat handleNext={handleNext} handlePrev={handlePrev} />
    case 6:
      return <Remarks handleNext={handleNext} handlePrev={handlePrev} />
    default:
      return null
  }
}

const UmrahFlightsStepper = () => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep(activeStep + 1)
      const updatedSteps = [...steps]
      updatedSteps[activeStep].status = 'complete'
      updatedSteps[activeStep].subtitle = 'Complete'
      if (activeStep + 1 < steps.length) {
        updatedSteps[activeStep + 1].status = 'inProgress'
        updatedSteps[activeStep + 1].subtitle = 'In Progress'
      }
    } else {
      alert('Submitted..!!')
    }
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
  
      const updatedSteps = [...steps]
      updatedSteps[activeStep].status = 'pending'
      updatedSteps[activeStep].subtitle = 'Pending'
      updatedSteps[activeStep - 1].status = 'inProgress'
      updatedSteps[activeStep - 1].subtitle = 'In Progress'
    }
  }

  return (
    <>
    <Card className='md:flex-row'>
      <CardContent className='max-md:border-be md:border-ie md:min-is-[300px]'>
        <StepperWrapper className='bs-full'>
          <Stepper activeStep={activeStep} orientation='horizontal'>
            {steps.map((step, index) => {
              return (
                <Step key={index} onClick={() => setActiveStep(index)}>
                  <StepLabel
                    slots={{
                      stepIcon: StepperCustomDot
                    }}
                    className='p-0'
                  >
                    <div className='step-label cursor-pointer'>
                      <div>
                        <Typography className='step-subtitle' color='text.primary'>{`step ${index + 1}`}</Typography>
                        <Typography className='step-title' color='text.primary'>
                          {step.title}
                        </Typography>
                        <Typography className='step-subtitle' color='text.primary'>
                          {step.subtitle}
                        </Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

   
    </Card>
    <Card className='mt-4'>
    <CardContent className='flex-1'>
        {getStepContent(activeStep, handleNext, handlePrev)}
      </CardContent>
      </Card>  
</>
)
}

export default UmrahFlightsStepper
