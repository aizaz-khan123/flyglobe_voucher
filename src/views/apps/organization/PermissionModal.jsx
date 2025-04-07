import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel } from "@mui/material";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";


const formatPermission = (str) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const PermissionModal = ({ isOpen, handleClose, permissionList, selectedPermissions, onSubmit, loading }) => {

    const [selected, setSelected] = useState(selectedPermissions);

    const handleToggle = (permissionUUID) => {
        setSelected((prevSelected) =>
            prevSelected.includes(permissionUUID)
                ? prevSelected.filter((uuid) => uuid !== permissionUUID)
                : [...prevSelected, permissionUUID]
        );
    };

    const handleSubmit = () => {
        onSubmit(selected);
    };

    return (
        <Dialog open={isOpen} fullWidth maxWidth='lg'>
            <DialogTitle className='font-semibold flex justify-between'>
                Manage Permissions
                <IoMdClose className='cursor-pointer' onClick={handleClose} />
            </DialogTitle>
            <DialogContent>
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {permissionList.map((permission) => (
                            <div key={permission.uuid} className="flex items-center justify-between bg-gray-100 p-2 rounded-md cursor-pointer">
                                <FormLabel htmlFor={permission.uuid} className="cursor-pointer">{formatPermission(permission.name)}</FormLabel>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={selected.includes(permission.uuid)}
                                        onChange={() => handleToggle(permission.uuid)}
                                        id={permission.uuid}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1/2 after:left-1 after:-translate-y-1/2 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <form method="dialog">
                    <Button variant='contained' onClick={handleSubmit} disabled={loading} loading={loading}>
                        Update Permission
                    </Button>
                </form>
            </DialogActions>
        </Dialog>
    );
};

export default PermissionModal;
