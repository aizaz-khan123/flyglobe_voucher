const CancellationInformation = ({ fareOptions }) => {
    return (
        <div className="space-y-4">
            {fareOptions.map((fare, index) => (
                <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-normal text-lg">
                        Fare Option {index + 1} - {fare.rbd}
                    </h3>
                    <p className=" mb-2">{fare.bagage_info}</p>

                    {/* Refundability Status */}
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${fare.is_refundable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {fare.is_refundable ? 'Refundable' : 'Non-Refundable'}
                    </div>

                    <div className="mt-2 text-sm">
                        <div className="mb-1">
                            <>Base Fare:</> {fare.price.currency} {fare.price.base_fare} + <>Tax:</> {fare.price.currency} {fare.price.tax}
                        </div>
                        <>Total Price:</> {fare.price.currency} {fare.price.gross_amount}
                    </div>

                    {/* Optional Cancellation Rules Block */}
                    <div className="mt-4 p-2 border rounded">
                        <h4 className="font-medium mb-1">Cancellation Rules</h4>
                        <p className="text-sm ">
                            {fare.is_refundable ? 'As per airline policy (Refundable)' : 'Non-refundable - No refund on cancellation'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CancellationInformation;
