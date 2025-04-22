'use client'
import StatusRefund from '@/components/booking/StatusRefund';
import React, { useEffect, useState } from 'react'
import AgencyDepositeRequestModal from './AgencyDepositeRequestModal';
import { Button, Card, CardContent, Table, TableBody, TableHead } from '@mui/material';
import { numberHelper } from '../refund-request/numberHelpers';
import { useDepositsAgencyListQuery } from '@/redux-store/services/api';


const RefundRequestRow = ({ depositeData }) => {
  const { bank, approved_by, deposit_amount, reciept, status, uuid } = depositeData;

  return (
    <>
      <TableRow className="hover:bg-base-200/40">
        <div className="px-4 py-2 font-medium">{bank?.bank_name}</div>
        <div>{numberHelper.formatAmountWithCommas(deposit_amount)}</div>
        <div className="px-4 py-2 font-medium">{approved_by}</div>
        <div className="font-medium">{status}</div>
        <div>
          <img src={reciept} height={50} width={50} alt="" />
        </div>
      </TableRow>
    </>
  );
};

const AgencyDeposits = () => {
  const [searchText, setSearchText] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [depositeRequestModal, setDepositeRequestModal] = useState(false);
  const { data: detail_data, isFetching, refetch: RefundRequestRefetch } = useDepositsAgencyListQuery({ searchText, pageUrl });
  const agencyDepositeDetails = detail_data?.data;
  const links = detail_data?.links;

  useEffect(() => {
    RefundRequestRefetch();
  }, []);

  const paginationClickHandler = (url) => {
    if (url) {
      setPageUrl(url)
    }
  };

  const handleDepositeRequestModal = () => {
    setDepositeRequestModal(prev => !prev);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-5 pt-5">
        <div className="inline-flex items-center">

        </div>
        <Button variant='contained' onClick={handleDepositeRequestModal}>
          Request Deposit
        </Button>
      </div>
      <Card className="mt-5 bg-base-100">
        <CardContent className={"p-2"}>
          <div className="overflow-auto">
            <Table className="rounded-box">
              <TableHead>
                <tr>
                  <th className="text-sm font-medium text-base-content/80">Bank</th>
                  <th className="text-sm font-medium text-base-content/80">Deposite Amount</th>
                  <th className="text-sm font-medium text-base-content/80">Approved By</th>
                  <th className="text-sm font-medium text-base-content/80">Status</th>
                  <th className="text-sm font-medium text-base-content/80">Reciept</th>
                </tr>
              </TableHead>

              <TableBody isLoading={isFetching} hasData={!!agencyDepositeDetails?.length}>
                {agencyDepositeDetails?.map((depositeData, index) => (
                  <RefundRequestRow
                    depositeData={depositeData}
                    key={index}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end px-5 pb-5 pt-3">
            {/* <Pagination pagination={links} clickHandler={paginationClickHandler} /> */}
          </div>
        </CardContent>
      </Card>

      <AgencyDepositeRequestModal
        isOpen={depositeRequestModal}
        handleDepositeRequestModal={handleDepositeRequestModal}
        RefundRequestRefetch={RefundRequestRefetch}
      />
    </>
  )
}

export default AgencyDeposits

