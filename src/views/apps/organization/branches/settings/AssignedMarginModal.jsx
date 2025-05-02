import { useEffect } from 'react'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { Controller, useForm } from 'react-hook-form'

import { useToast } from '@/hooks/use-toast'
import { useAssignToBranchByAirlineMutation, useBranchMarginsQuery } from '@/redux-store/services/api'

import MuiTextField from '@/components/mui-form-inputs/MuiTextField'
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown'

const AssignedMarginModal = ({ isOpen, refetch, handleClose, branchId }) => {
  console.log('branchId', branchId)

  const {
    data: branchMarginData,
    isFetching: isFetchingBranch,
    refetch: refetchBranch
  } = useBranchMarginsQuery({ branch_id: branchId })

  const [assignMarginApiTrigger, { isLoading }] = useAssignToBranchByAirlineMutation()
  const toaster = useToast()

  useEffect(() => {
    refetchBranch()
  }, [])

  const initialValues = {
    branch_id: branchId,
    branchData:
      branchMarginData?.map(data => ({
        margin: data.margin || '',
        margin_type: data.margin_type || '',
        margin_id: data?.margin_id,
        assigned: data?.assigned || false
      })) || []
  }

  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: initialValues
  })

  const setErrors = errors => {
    Object.entries(errors).forEach(([key, value]) => setError(key, { message: value }))
  }

  const onSubmit = handleSubmit(async data => {
    await assignMarginApiTrigger(data).then(response => {
      if ('error' in response) {
        setErrors(response?.error.data?.errors)

        return
      }

      if (response.data?.code == 200) {
        toaster.success(response?.data?.message)
        refetch()
        handleClose()
      } else {
        setErrors(response?.data?.errors)
      }
    })
  })

  useEffect(() => {
    if (branchMarginData?.length) {
      const initialValues = {
        branch_id: branchId,
        branchData: branchMarginData.map(data => ({
          margin: data.margin || '',
          margin_type: data.margin_type || '',
          margin_id: data?.margin_id,
          assigned: data?.assigned || false
        }))
      }

      reset(initialValues)
    }
  }, [branchMarginData, reset, branchId])

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth='lg'>
      <DialogTitle className='font-bold flex items-center justify-between'>
        Assign Margin
        <IconButton aria-label='close' onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Margin</TableCell>
                <TableCell>Margin Type</TableCell>
                <TableCell>Assigned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetchingBranch ? (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : branchMarginData?.length ? (
                branchMarginData.map((data, index) => (
                  <TableRow key={data.margin_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data.margin_name}</TableCell>
                    <TableCell>
                      <MuiTextField
                        control={control}
                        size='small'
                        id={`margin-${index}`}
                        name={`branchData.${index}.margin`}
                        placeholder='Enter Margin'
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <MuiDropdown
                        control={control}
                        name={`branchData.${index}.margin_type`}
                        size='small'
                        id={`margin_type-${index}`}
                        options={[
                          { label: 'Amount', value: 'amount' },
                          { label: 'Percentage', value: 'percentage' }
                        ]}
                        placeholder='Select Type'
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title='Assign Margin' placement='top'>
                        <div>
                          <Controller
                            name={`branchData.${index}.assigned`}
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={<Switch {...field} checked={!!field.value} color='primary' />}
                              />
                            )}
                          />
                        </div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onSubmit} variant='contained' disabled={isLoading} loading={isLoading}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignedMarginModal
