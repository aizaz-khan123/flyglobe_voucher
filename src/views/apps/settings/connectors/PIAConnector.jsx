"use client";

import { useEffect } from "react";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Card, CardContent, FormLabel } from "@mui/material";

import { useForm } from "react-hook-form";

import MuiTextField from "@/components/mui-form-inputs/MuiTextField";


import MuiDropdown from "@/components/mui-form-inputs/MuiDropdown";
import { useGetSupplierListQuery, useShowConnectorQuery, useUpdateConnectorMutation } from "@/redux-store/services/api";




const PIAConnector = () => {
    // const toaster = useToast();
    const { data: supplierDropDown } = useGetSupplierListQuery();
    const { data: connector, isSuccess: isConnectorSuccess } = useShowConnectorQuery('PIA_HITIT');
    const [updateConnector, { isLoading: isUpdateLoading }] = useUpdateConnectorMutation();

    const connectorSchema = z.object({
        api_key: z.string({ required_error: "UserName Required!" }),
        api_secret: z.string({ required_error: "Password Required!" }),
        client_ip: z.string({ required_error: "CLIENT IP ADDRESS Required!" }).ip({ version: "v4", message: "Invalid IPv4 address!" }),
        supplier_id: z.number({ required_error: "Supplier ID Required!" }).min(1, "Supplier ID is required!"),
        is_enable: z.boolean(),
    });

    const { control, handleSubmit, reset } = useForm({
        resolver: zodResolver(connectorSchema)
    });

    useEffect(() => {
        if (isConnectorSuccess && connector) {
            reset({
                api_key: connector.api_key,
                api_secret: connector.api_secret,
                client_ip: connector.client_ip,
                is_enable: connector.is_enable,
                supplier_id: connector.supplier_id
            });
        }
    }, [connector, isConnectorSuccess, reset]);

    const onSubmit = handleSubmit(async (data) => {
        const updated_data = {
            ...data,
            name: 'PIA (HITIT)',
            type: "PIA_HITIT",
        }

        await updateConnector(updated_data).then((response) => {
            if (response.data?.code == 200) {
                // toaster.success('HITIT Api Credentials Updated!');
            }
        });
    });

    
return (
        <>
            <Card className="mt-5 bg-base-100">
                <CardContent className={"p-0"}>
                    <CardContent className="gap-0">
                        <div>PIA (HITIT) API Credentials</div>
                        <div className="mt-1 grid grid-cols-1 gap-5 gap-y-3 md:grid-cols-2">
                            <div>
                                <FormLabel title={"Client Ip Address"} htmlFor="client_ip"></FormLabel>
                                <MuiTextField
                                    className="w-full border-0 focus:outline-0"
                                    control={control}
                                    size="md"
                                    id="client_ip"
                                    name="client_ip"
                                    placeholder="Enter Client Ip Address"
                                />
                            </div>
                            <div>
                                <FormLabel title={"UserName"} htmlFor="api_key"></FormLabel>
                                <MuiTextField
                                    className="w-full border-0 focus:outline-0"
                                    control={control}
                                    size="md"
                                    id="api_key"
                                    name="api_key"
                                    placeholder="Enter UserName"
                                />
                            </div>
                            <div>
                                <FormLabel title={"Password"} htmlFor="api_secret"></FormLabel>
                                <MuiTextField
                                    className="w-full border-0 focus:outline-0"
                                    control={control}
                                    size="md"
                                    id="api_secret"
                                    name="api_secret"
                                    placeholder="Enter Password"
                                />
                            </div>
                            <div>
                                <FormLabel title="Supplier" htmlFor="supplier_id" />
                                {supplierDropDown ? (
                                    <MuiDropdown
                                        control={control}
                                        name="supplier_id"
                                        size="md"
                                        id="supplier_id"
                                        className="w-full border-0 text-base"
                                        options={supplierDropDown.map((supplier) => {
                                            return {
                                                label: supplier.name,
                                                value: supplier.id,
                                            };
                                        })}
                                        placeholder="Select Supplier"
                                    />
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>

                            {/* <div>
                                <Form className="mt-1 w-fit rounded-lg">
                                    <FormLabel title="Status">
                                        <FormToggle control={control} aria-FormLabel="Toggle" name="is_enable" className="m-2" color="primary" />
                                    </FormLabel>
                                </Form>
                            </div> */}
                        </div>

                        <div className="mt-6 flex justify-end gap-6">
                            <Button
                                color="primary"
                                size="md"
                                onClick={onSubmit}

                                // startIcon={}
                                loading={isUpdateLoading}
                                variant="contained"
                            >
                                Update
                            </Button>
                        </div>
                    </CardContent>
                </CardContent>
            </Card>


        </>
    );
};

export { PIAConnector };
