// import moment from "moment";

// declare global {
//     interface Date {
//         format(format: string): string;
//     }
// }
// 
// Date.prototype.format = function(format: string) {
//     return moment().format(format);
// }


// export {};


export {};



declare global {
    interface Date {
        momentFormat(format: string): string;
    }
  }
  