declare const formatTime: (time: number) => string;
declare const getAmPm: (date: any) => "am" | "pm";
declare const hourToDegrees: (date: any) => number;
declare const isAm: (date: any) => boolean;
declare const minuteToDegrees: (date: any) => number;
declare const toggleAmPm: (date: any, toAm: boolean) => any;
export { getAmPm, formatTime, hourToDegrees, isAm, minuteToDegrees, toggleAmPm, };
