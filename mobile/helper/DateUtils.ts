export const convertDateToEpoch = (date: Date): number => {
    return Math.floor(date.getTime() / 1000);
}

export const convertEpochToDate = (epoch: number): Date => {
    return new Date(Number(epoch) * 1000); 
}





