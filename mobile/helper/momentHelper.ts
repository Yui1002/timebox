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

export const getBeginningOfDay = () => {
    return moment().startOf('day').toDate();
}