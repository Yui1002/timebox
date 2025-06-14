import moment, { Moment } from 'moment';

export const getDiff = (start: Date | undefined, end: Date | undefined): number | null => {
    if (!start || !end) return null;

    return moment(end).diff(start, 'hours');
}

export const getBeginningOfDay = (date: Date = new Date()): Date => {
    return moment(date).startOf('day').toDate();
}

export const getEndOfDay = (date: Date = new Date()): Date => {
    return moment(date).endOf('day').toDate();
}

export const getPrevDay = (daysAgo: number): string => {
    return moment().subtract(daysAgo, 'days').format('MM-DD-YYYY');
}