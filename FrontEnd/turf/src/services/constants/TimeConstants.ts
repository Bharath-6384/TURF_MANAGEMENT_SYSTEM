  export const formatTime = (time: string) => {
    const [hourStr, minuteStr] = time.split(":");
    let hour = Number(hourStr);
    const suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, "0")}:${minuteStr} ${suffix}`;
};