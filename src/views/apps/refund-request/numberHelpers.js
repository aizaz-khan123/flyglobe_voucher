//helper function to format the date

const generateRandomIntegerAround = (valu, maxVariation) => {
    return Math.floor(Math.random() * maxVariation * 2 + 1) + (value - maxVariation);
};
const formatAmountWithCommas = (amount) => {
    if (typeof amount !== 'number') return '0';
    return amount.toLocaleString();
};


export const numberHelper = {
    generateRandomIntegerAround,
    formatAmountWithCommas,
};

//helper end
