type Schedule = {
    id: number;
    day: string | null;
    startTime: string | null;
    endTime: string | null;
}

type ServiceProvider = {
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  rate: number;
  rate_type: string;
  schedule: Schedule[] | [];
  allow_edit: boolean;
}

type RawEmployer = {
    firstName: string;
    lastName: string;
    email: string;
    mode: number;
}

type FormattedEmployer = {
    label: string;
    value: string;
}

type Record = {
    id: number;
    startTime: string | null;
    endTime: string | null;
}

export { Schedule, ServiceProvider, RawEmployer, FormattedEmployer, Record }
