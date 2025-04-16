import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    CircularProgress,
    Switch,
    Badge,
    TablePagination,
    FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useToast } from '@/hooks/use-toast';
import { useAssignMarginBranchMutation, useBranchMarginQuery } from '@/redux-store/services/api';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import MuiTextField from '@/components/mui-form-inputs/MuiTextField';
import MuiDropdown from '@/components/mui-form-inputs/MuiDropdown';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

const AssignMarginModal = ({ isOpen, refetch, handleClose, marginUUid }) => {
    const { data: branchMarginData, isFetching: isFetchingBranch, refetch: refetchBranch } = useBranchMarginQuery({ margin_id: marginUUid });
    const [assignMarginApiTrigger, { isLoading }] = useAssignMarginBranchMutation();
    const toaster = useToast();

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        refetchBranch();
    }, []);

    const initialValues = {
        margin_id: marginUUid,
        branchData: branchMarginData?.map((data) => ({
            margin: data.margin || "",
            margin_type: data.margin_type || "",
            branch_id: data?.branch_id,
            branch_name: data?.branch_name || "",
            assigned: data?.assigned || false,
        })) || [],
    };

    const { control: controlAssignModal, handleSubmit, reset, setError } = useForm({
        defaultValues: initialValues
    });

    const setErrors = (errors) => {
        Object.entries(errors).forEach(([key, value]) =>
            setError(key, { message: value })
        );
    };

    const onSubmit = handleSubmit(async (data) => {
        await assignMarginApiTrigger(data).then((response) => {
            if ('error' in response) {
                setErrors(response?.error.data?.errors);
                return;
            }
            if (response.data?.code == 200) {
                toaster.success(response?.data?.message);
                refetch();
                handleClose();
            } else {
                setErrors(response?.data?.errors)
            }
        });
    });

    useEffect(() => {
        if (branchMarginData?.length) {
            const initialValues = {
                margin_id: marginUUid,
                branchData: branchMarginData.map((data) => ({
                    margin: data.margin || "",
                    margin_type: data.margin_type || "",
                    branch_id: data.branch_id,
                    branch_name: data.branch_name || "",
                    assigned: data?.assigned || false,
                })),
            };
            reset(initialValues);
        }
    }, [branchMarginData, reset, marginUUid]);

    // Table setup
    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.accessor('branch_id', {
                header: 'ID',
                cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>
            }),
            columnHelper.accessor('branch_name', {
                header: 'Branch Name',
                cell: ({ row }) => <div className='flex items-center space-x-3 truncate'>{row.original.branch_name}</div>
            }),
            columnHelper.accessor('margin', {
                header: 'Margin',
                cell: ({ row }) => (
                    <MuiTextField
                        control={controlAssignModal}
                        size="small"
                        name={`branchData.${row.index}.margin`}
                        placeholder="Enter Margin"
                        fullWidth
                    />
                )
            }),
            columnHelper.accessor('margin_type', {
                header: 'Margin Type',
                cell: ({ row }) => (
                    <MuiDropdown
                        control={controlAssignModal}
                        name={`branchData.${row.index}.margin_type`}
                        size="small"
                        options={[
                            { label: 'Amount', value: 'amount' },
                            { label: 'Percentage', value: 'percentage' }
                        ]}
                    />
                )
            }),
            columnHelper.accessor('assigned', {
                header: 'Assigned',
                cell: ({ row }) => (
                    <Tooltip title="Assign Margin" placement="top">
                        <div>
                            <Controller
                                name={`branchData.${row.index}.assigned`}
                                control={controlAssignModal}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                {...field}
                                                checked={!!field.value}
                                                color="primary"
                                            />
                                        }
                                    />
                                )}
                            />
                        </div>
                    </Tooltip>
                )
            }),
        ],
        []
    );

    const table = useReactTable({
        data: branchMarginData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle className='font-bold flex items-center justify-between'>
                Assign Margin
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <div className='overflow-x-auto p-5'>
                    <table className='w-full border-collapse'>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className='text-left p-3 border-b'>
                                            {header.isPlaceholder ? null : (
                                                <div>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isFetchingBranch ? (
                                <tr>
                                    <td colSpan={columns.length}>
                                        <div className='flex justify-center items-center py-5'>
                                            <CircularProgress size={24} />
                                        </div>
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className='hover:bg-gray-50'>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className='p-3 border-b'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className='text-center p-5'>
                                        No branches found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component='div'
                    count={branchMarginData?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignMarginModal;
