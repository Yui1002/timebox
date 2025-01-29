import {Days} from '../enums';
import {Request, UserSchedule} from '../swagger';

export const formatData = (requests: Request[]): Request[] => {
  let result: Request[] = [];
  
  for (let i = 0; i < requests.length; i++) {
    let senderEmail = requests[i].senderEmail;
    let doesEmailExist = result.find(r => r.senderEmail === senderEmail);

    let schedule: UserSchedule = {
      day: requests[i].day,
      startTime: requests[i].startTime,
      endTime: requests[i].endTime,
    };
    
    if (!doesEmailExist) {
      requests[i].schedules!.push(schedule)
      result.push(requests[i]);
    } else {
      doesEmailExist.schedules!.push(schedule);
    }
  }
  return sortDays(result);;
};

export const sortDays = (requests: Request[]): Request[] => {
  const weekdayOrder: string[] = Object.values(Days);

  for (let i = 0; i < requests.length; i++) {
    requests[i].schedules?.sort(
      (schedule1: UserSchedule, schedule2: UserSchedule): number => {
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


