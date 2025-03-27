
const BaggageInformation = ({ fareOptions }) => {
    return (
        <div className="space-y-4">
            {fareOptions.map((fare, index) => (
                <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">
                        Fare Option {index + 1} - {fare.rbd}
                    </h3>

                    {fare.baggageInformation && (
                        <div className="space-y-2">
                            {Object.entries(fare.baggageInformation).map(([passengerType, baggages]) => {
                                let checkedBaggage = "";
                                let cabinBaggage = "";

                                baggages.forEach((baggage) => {
                                    if (baggage.provisionType === "A") {
                                        checkedBaggage = `Checked Baggage: ${baggage.weight ?? 25}kg`;
                                    } else if (baggage.provisionType === "B") {
                                        cabinBaggage = `Cabin Baggage: ${baggage.pieceCount ?? 1} x ${baggage.weight ?? 7}kg`;
                                    }
                                });

                                return (
                                    <div key={passengerType}>
                                        <h4 className="font-medium">{passengerType} Baggage:</h4>
                                        <div className="space-y-1">
                                            {checkedBaggage && (
                                                <div className="text-sm">{checkedBaggage}</div>
                                            )}
                                            {cabinBaggage && (
                                                <div className="text-sm">{cabinBaggage}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    )}

                    <div className="mt-2 text-sm">
                        <div className="mb-1">
                            <strong>Base Fare:</strong> {fare.price.currency} {fare.price.base_fare} + <strong>Tax:</strong> {fare.price.currency} {fare.price.tax}
                        </div>
                        <strong>Total Price:</strong> {fare.price.currency} {fare.price.gross_amount}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BaggageInformation;
