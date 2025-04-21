

const StatusRefund = ({ status }) => {
    if (status == "processing") {
        return (
            <div className="inline rounded-badge border border-primary/50 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                Processing
            </div>
        );
    }
    else if (status == "approved") {
        return (
            <div className="inline rounded-badge border border-success/50 bg-success/5 px-3 py-1 text-xs font-medium text-success">
                Approved
            </div>
        );
    } else if (status == "rejected") {
        return (
            <div className="inline rounded-badge border border-error/50 bg-error/5 px-3 py-1 text-xs font-medium text-error">
                Rejected
            </div>
        );
    }
};

export default StatusRefund;
