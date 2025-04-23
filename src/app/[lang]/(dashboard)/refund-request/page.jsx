
import { RefundRequestTable } from "@/views/apps/refund-request/RefundRequestTable";


export const metadata = {
    title: "Refund Requests",
};

const page = () => {

    return (
        <div>
            {/* <PageTitle
                title={"Refund Requests"}
                breadCrumbItems={[{ label: "Refund Requests", active: true }]}
            /> */}
            Refund Requests
            <div className="mt-5">
                <RefundRequestTable />
            </div>
        </div>
    );
};

export default page;
