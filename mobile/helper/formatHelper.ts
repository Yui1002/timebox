import {Days} from '../enums';
import {GetRequestRsMini, GetServiceProviderRsMini, UserSchedule} from '../swagger';

export const formatData = (data: any): GetServiceProviderRsMini[] | GetRequestRsMini[] => {
  let result: GetServiceProviderRsMini[] | GetServiceProviderRsMini = [];
  
  for (let i = 0; i < data.length; i++) {
    let email = data[i].email;
    let doesEmailExist = result.find(r => r.email === email);

    let schedule: UserSchedule = {
      day: data[i].day,
      start_time: data[i].start_time,
      end_time: data[i].end_time,
    };

    if (!doesEmailExist) {
      data[i].schedules!.push(schedule)
      result.push(data[i]);
    } else {
      doesEmailExist.schedules!.push(schedule);
    }
  }
  return sortDays(result);;
};

export const sortDays = (data: GetServiceProviderRsMini[] | GetRequestRsMini[]): GetServiceProviderRsMini[] | GetRequestRsMini[] => {
  const weekdayOrder: string[] = Object.values(Days);

  for (let i = 0; i < data.length; i++) {
    data[i].schedules?.sort(
      (schedule1: UserSchedule, schedule2: UserSchedule): number => {
        if (!schedule1.day || !schedule2.day) return 0;
        return (
          weekdayOrder.indexOf(schedule1.day) -
          weekdayOrder.indexOf(schedule2.day)
        );
      },
    );
  }

  return data;
};


