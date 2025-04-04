export const ensurePrefix = (str, prefix) => (str.startsWith(prefix) ? str : `${prefix}${str}`)
export const withoutSuffix = (str, suffix) => (str.endsWith(suffix) ? str.slice(0, -suffix.length) : str)
export const withoutPrefix = (str, prefix) => (str.startsWith(prefix) ? str.slice(prefix.length) : str)

const convertToStorageUnits = (bytes) => {
    const units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    let l = 0;
    let n = parseInt(String(bytes), 10) || 0;

    while (n >= 1024 && ++l) {
        n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
};

const convertToCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const snackToNormal = (text) => {
    return text.replaceAll("_", " ");
};

const convertToFixed = (number, fixed = 2) => {
    const n = number.toFixed(fixed);

    if (Math.floor(Number(n)) == number) return number.toString();
    
return n;
};

const capitalizedWord = (word) => {
    let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

    
return capitalizedWord;
}

const convertToAlpa = (key) => {
    const a = {
        1: '1st Flight',
        2: '2nd Flight',
        3: '3rd Flight',
        4: '4th Flight',
        5: '5th Flight'
    };

    return a[key];
};

const passengerType = (key) => {
    const a = {
        'ADT': 'Adult',
        'CNN': 'Child',
        'INF': 'Infant',
    };

    return a[key];
};

export const stringHelper = {
    convertToStorageUnits,
    convertToCurrency,
    convertToFixed,
    snackToNormal,
    capitalizedWord,
    convertToAlpa,
    passengerType
};
