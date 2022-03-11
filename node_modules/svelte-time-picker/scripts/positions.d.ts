declare const getDateFromHoursPosition: (date: any, position: any, width: number, is24h: boolean, isAm: boolean) => any;
declare const getDateFromMinutesPosition: (date: any, position: any, minutesIncrement: number) => any;
declare const getPosition: (event: any) => {
    x: number;
    y: number;
};
export { getDateFromHoursPosition, getDateFromMinutesPosition, getPosition, };
