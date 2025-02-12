import moment, { Moment } from 'moment';

interface GetDiffProps {
    start: Moment | string | null | undefined;
    end: Moment | string | null | undefined;
}

export const getDiff = ({start, end}: GetDiffProps): number | null => {
    if (!start || !end) {
        return null;
    }
    start = moment(start);
    end = moment(end);

    return end.diff(start, 'hours');
}

export const getBeginningOfDay = (date: Date = new Date()): Date => {
    return moment(date).startOf('day').toDate();
}

export const getEndOfDay = (date: Date = new Date()): Date => {
    return moment(date).endOf('day').toDate();
}