import moment, { Moment } from 'moment';

export const getDiff = (start: Date | undefined, end: Date | undefined): number | null => {
    if (!start || !end) return null;

    const diffInMinutes = moment(end).diff(start, 'minutes');
    const hours = diffInMinutes / 60;

    return Math.round(hours * 10) / 10;
}

export const getBeginningOfDay = (date: Date = new Date()): Date => {
    return moment(date).startOf('day').toDate();
}

export const getEndOfDay = (date: Date = new Date()): Date => {
    return moment(date).endOf('day').toDate();
}

export const getPrevDay = (daysAgo: number): Moment => {
    return moment().subtract(daysAgo, 'days');
}