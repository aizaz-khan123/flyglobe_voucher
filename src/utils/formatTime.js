export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    
return `00:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const formatTimeInPK = (dateTime) => {
    const date = new Date(dateTime);

    
return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const formatTimeDifference = (departure, arrival) => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);

    const diffInMilliseconds = arrivalDate - departureDate;
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);

    const days = Math.floor(diffInMinutes / (24 * 60));
    const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
    const minutes = diffInMinutes % 60;

    return days > 0 ? `${days}D ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
};
