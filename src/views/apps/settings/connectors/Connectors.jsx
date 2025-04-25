import { AirblueConnector } from './AirblueConnector'
import { PIAConnector } from './PIAConnector'
import { SABREConnector } from './SABREConnector'

const Connectors = () => {
  return (
    <>
      <PIAConnector />
      <SABREConnector />
      <AirblueConnector />
    </>
  )
}

export default Connectors
