
// declare global {
//     interface Date {
//         format(format: string): string;
//     }
// }

// Date.prototype.format = function(format: string) {
//     return moment().format(format);
// }
export {}
import moment from "moment";

declare global {
  interface Date {
      momentFormat(format: string): string | null;
  }
}

Date.prototype.momentFormat = function(format: string): string {
  return moment(this).format(format);
};