import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'

import { useLazyManagementGroupDeleteQuery } from '@/redux-store/services/api'

const GroupDeleteModal = ({ open, onClose, groupDataByID, refetch }) => {
  const [deleteGroupType, { isLoading }] = useLazyManagementGroupDeleteQuery()

  const handleDeleteGroupType = async () => {
    if (groupDataByID) {
      deleteGroupType(groupDataByID.uuid).then(response => {
        if (response?.data.code == 200) {
          toast.success(response?.data.message)
          onClose()
          refetch()
        } else {
          toast.error(response?.data.message)
        }
      })
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle className='font-bold flex items-center justify-between'>
          Confirm Delete
          <IoMdClose className='cursor-pointer' onClick={onClose} />
        </DialogTitle>
        <DialogContent>
          You are about to delete <b>{groupDataByID?.sector}</b>. Would you like to proceed further?
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={onClose} disabled={isLoading}>
            No
          </Button>
          <Button variant='contained' onClick={handleDeleteGroupType} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default GroupDeleteModal
