import moment, { Moment } from 'moment';

interface GetDiffProps {
    start: Moment | string | null;
    end: Moment | string | null;
}

export const getDiff = ({start, end}: GetDiffProps): number | null => {
    if (!start || !end) {
        return null;
    }
    start = moment(start);
    end = moment(end);

    return end.diff(start, 'hours');
}

export const returnFormat = (value: string | null, format: string): string => {
    return moment(value).format(format);
}

export const getBeginningOfDay = () => {
    console.log(moment().startOf('day').toDate())
    return moment().startOf('day').toDate();
}