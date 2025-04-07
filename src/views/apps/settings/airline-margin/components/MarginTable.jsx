"use client";
import Link from "next/link";
// import Pagination from "@/components/Pagination/Pagination";
// import { routes } from "@/lib/routes";

// import { IAirlineMargin } from "@/types/settings/airline_margins";
import { useBranchDropDownQuery, useDeleteAirlineMarginMutation, useGetAirlineMarginsQuery } from "@/redux-store/services/api";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SearchInput from "@/components/searchInput/SearchInput";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import { AirlineMarginRow } from "./AirlineMarginRow";
import { routes } from "@/libs/routes";
import { TbMoodAnnoyed } from "react-icons/tb";
import MuiTextField from "@/components/mui-form-inputs/MuiTextField";
import MuiDropdown from "@/components/mui-form-inputs/MuiDropdown";

const MarginTable = () => {
    // const toaster = useToast();
    const [searchText, setSearchText] = useState("");
    const [pageUrl, setPageUrl] = useState("");
    const [marginModal, setMarginModal] = useState("");
    const [marginTypeModal, setMarginTypeModal] = useState("");

    const { data: detail_data, isFetching, refetch } = useGetAirlineMarginsQuery({ searchText, pageUrl });
    const airline_margins = detail_data?.data;
    const links = detail_data?.links;
    const [deleteAirlineMargin, {
        isLoading: deleteAirlineMarginLoading,
    }] = useDeleteAirlineMarginMutation();
// branch dropdown 
const { data: branchDropdownData, isFetching:isFetchingBranch, refetch:refetchBranch } = useBranchDropDownQuery()

const initialValues = {
    branchData: branchDropdownData?.map((data) => ({
        margin: marginModal || "", 
        margin_type: marginTypeModal || "amount",
    })) || [],
    // user: branchDropdownData?.map((data) => ({
    //     id: data?.id,
    //     name: data?.name
    //   }))
  };
  
  const { control:controlAssignModal, handleSubmit, reset } = useForm({
    defaultValues: initialValues,
  });
 const onSubmit = handleSubmit(async (data) => {

        const updated_data = {
            _method: 'put',
            ...data
        }
        
        // await updateAirlineMargin({ airlineMarginId, updated_data }).then((response) => {

        //     if('error' in response){
        //         setErrors(response?.error.data?.errors);
        //         return;
        //     }
        //     if (response.data?.code == 200) {
        //         toaster.success(response?.data?.message);
        //         refetch();
        //         router.push(routes.apps.settings.airline_margins);
        //     } else {
        //         setErrors(response?.data?.errors)
        //     }
        // });
    });  
  useEffect(() => {
    reset(initialValues); 
}, [marginModal, marginTypeModal, reset]);
    useEffect(() => {
        refetch()
    }, [searchText, pageUrl])
    const [AirlineMarginToBeDelete, setAirlineMarginToBeDelete] = useState();
    const AirlineMarginDeleteConfirmationRef = useRef(null);
    const AirlineMarginAssignConfirmationRef = useRef(null);

    const { control: filterControl } = useForm({
        defaultValues: {
            category: "default",
            search: "",
        },
    });

    const showDeleteAirlineMarginConfirmation = (uuid) => {
        AirlineMarginDeleteConfirmationRef.current?.showModal();
        setAirlineMarginToBeDelete(airline_margins?.find((b) => uuid === b.uuid));
    };
    const showAssignAirlineMarginConfirmation = (margin,margin_type) => {
        AirlineMarginAssignConfirmationRef.current?.showModal();
        setMarginModal(margin?.toString());
        setMarginTypeModal(margin_type)
    };

    const handleDeleteAirlineMargin = async () => {
        if (AirlineMarginToBeDelete) {
            deleteAirlineMargin(AirlineMarginToBeDelete.uuid).then((response) => {
                if (response?.data.code == 200) {
                    // toaster.success(response?.data.message);
                } else {
                    // toaster.error(response?.data.message);
                }
            });
        }
    };

    const paginationClickHandler = (url) => {
        if (url) {
            setPageUrl(url)
        }
    };

    return (
        <>
            <Card className="mt-5 bg-base-100">
                <CardContent className={"p-0"}>
                    <div className="flex items-center justify-between px-5 pt-5">
                        <div className="inline-flex items-center gap-3">
                            <SearchInput onSearch={setSearchText} control={filterControl} />
                        </div>
                        <div className="inline-flex items-center gap-3">
                            <Link href={routes.apps.settings.airline_margin_create} aria-label={"Create product link"}>
                                <Button color="primary" size="md" className="hidden md:flex">
                                    <FaPlus  fontSize={16} />
                                    <span>New Airline Margin</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto p-5">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                <td className="text-sm font-medium text-base-content/80">ID</td>
                                <td className="text-sm font-medium text-base-content/80">Sales Channel</td>
                                <td className="text-sm font-medium text-base-content/80">Airline</td>
                                <td className="text-sm font-medium text-base-content/80">Pricing</td>
                                <td className="text-sm font-medium text-base-content/80">Region</td>
                                <td className="text-sm font-medium text-base-content/80">Apply on gross fare</td>
                                <td className="text-sm font-medium text-base-content/80">Status</td>
                                <td className="text-sm font-medium text-base-content/80">Rbds</td>
                                <td className="text-sm font-medium text-base-content/80">Remarks</td>
                                <td className="text-sm font-medium text-base-content/80">Action</td>
                                </tr>
                            </thead>

                            <tbody isLoading={isFetching} hasData={!!airline_margins?.length}>
                                {airline_margins?.map((airline_margin, index) => (
                                    <AirlineMarginRow
                                        airline_margin={airline_margin}
                                        key={airline_margin.uuid}
                                        showDeleteAirlineMarginConfirmation={showDeleteAirlineMarginConfirmation}
                                        showAssignAirlineMarginConfirmation={showAssignAirlineMarginConfirmation}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* <div className="flex items-center justify-end px-5 pb-5 pt-3">
                        <Pagination pagination={links} clickHandler={paginationClickHandler} />
                    </div> */}
                </CardContent>
            </Card>
            {/* delete modal  */}
            <Dialog ref={AirlineMarginDeleteConfirmationRef} backdrop>
                <form method="dialog">
                    <Button
                        size="sm"
                        color="ghost"
                        shape="circle"
                        className="absolute right-2 top-2"
                        aria-label="Close modal">
                        {/* <Icon icon={xIcon} className="h-4" /> */}
                        X
                    </Button>
                </form>
                <DialogTitle className="font-bold">Confirm Delete</DialogTitle>
                <DialogContent>
                    You are about to delete. Would you like to proceed further ?
                </DialogContent>
                <DialogActions>
                    <form method="dialog">
                        <Button color="error" size="sm">
                            No
                        </Button>
                    </form>
                    <form method="dialog">
                        <Button loading={deleteAirlineMarginLoading} color="primary" size="sm" onClick={() => handleDeleteAirlineMargin()}>
                            Yes
                        </Button>
                    </form>
                </DialogActions>
            </Dialog>
            {/* assign modal  */}
            <Dialog className="w-11/12 max-w-6xl h-11/12" ref={AirlineMarginAssignConfirmationRef} backdrop>
                <form method="dialog">
                    <Button
                        size="sm"
                        color="ghost"
                        shape="circle"
                        className="absolute right-2 top-2"
                        aria-label="Close modal">
                            X
                        {/* <Icon icon={xIcon} className="h-4" /> */}
                    </Button>
                </form>
                <DialogTitle className="font-bold">Assign Margin</DialogTitle>
                <DialogContent>
                <div className="overflow-auto">
                        <table className="mt-2 rounded-box">
                            <thead>
                                <tr>
                                <td className="text-sm font-medium text-base-content/80">ID</td>
                                <td className="text-sm font-medium text-base-content/80">Name</td>
                                <td className="text-sm font-medium text-base-content/80">Margin</td>
                                <td className="text-sm font-medium text-base-content/80">Margin Type</td>
                                </tr>
                            </thead>

                            <tbody isLoading={isFetching} hasData={!!branchDropdownData?.length}>
                                {branchDropdownData?.map((data, index) => {                                    
                                    return(
                                //    <TableRow className="hover:bg-base-200/40">
                                <>
                                   <div className="font-medium">{index+1}</div>
                                   <div className="flex items-center space-x-3 truncate">{data?.name}</div>
                                   <div>
                                    <MuiTextField
                                        className="w-64 border-0 focus:outline-0"
                                        control={controlAssignModal}
                                        size="md"
                                        id={`margin-${index}`}
                                        name={`branchData.${index}.margin`} 
                                        placeholder="Enter Margin"
                                        wrapperClassName="w-[29rem]"
                                    />
    
                                </div>
                             <div>
                                    <MuiDropdown
                                        control={controlAssignModal}
                                        name={`branchData.${index}.margin_type`}
                                        size="md"
                                        id={`margin_type-${index}`}
                                        className="w-full border-0 text-base w-[18rem]"
                                        options={[{ id: 'amount', name: 'Amount' }, { id: 'percentage', name: 'Percentage' }].map((connector) => ({
                                            label: connector.name,
                                            value: connector.id,
                                        }))}
                                    />
                            </div>
                            </>
                                //    </TableRow>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
                <DialogActions>
                    <form method="dialog">
                        <Button color="error" size="sm">
                            No
                        </Button>
                    </form>
                    <form method="dialog">
                        <Button loading={deleteAirlineMarginLoading} color="primary" size="sm" onClick={onSubmit}>
                            Yes
                        </Button>
                    </form>
                </DialogActions>
            </Dialog>
        </>
    );
};

export { MarginTable };
