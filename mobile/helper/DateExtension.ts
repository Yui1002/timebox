export {}
import moment from "moment";

declare global {
  interface Date {
      momentFormat(format: string): string;
  }
}

Date.prototype.momentFormat = function(format?: string): string {
  return moment(this).format(format);
};
