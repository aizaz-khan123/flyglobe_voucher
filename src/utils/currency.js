const sign = "$";

export const currencyHelper = {
    sign,
};

export const formatCurrency = (amount) => {
    return `PKR ${amount.toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};
