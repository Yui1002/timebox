import {Days} from '../enums';
import {Request, GetUserScheduleRs} from '../swagger';

export const formatData = (requests: Request[]): Request[] => {
  let result: Request[] = [];

  for (let i = 0; i < requests.length; i++) {
    let senderEmail = requests[i].senderEmail;
    let doesEmailExist = result.find(r => r.senderEmail === senderEmail);

    if (doesEmailExist) {
      let schedulesArray = doesEmailExist.schedules;
      let schedule: GetUserScheduleRs = {
        day: doesEmailExist.day,
        startTime: doesEmailExist.startTime,
        endTime: doesEmailExist.endTime,
      };
      schedulesArray?.push(schedule);
    } else {
      result.push(requests[i]);
    }
  }
  return sortDays(result);
};

export const sortDays = (requests: Request[]): Request[] => {
  const weekdayOrder: string[] = Object.values(Days);

  for (let i = 0; i < requests.length; i++) {
    requests[i].schedules?.sort(
      (schedule1: GetUserScheduleRs, schedule2: GetUserScheduleRs): number => {
        if (!schedule1.day || !schedule2.day) return 0;
        return (
          weekdayOrder.indexOf(schedule1.day) -
          weekdayOrder.indexOf(schedule2.day)
        );
      },
    );
  }

  return requests;
};
