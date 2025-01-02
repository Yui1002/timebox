// import UserManagers from "../managers/userManagers";

// class UserControllers {
//   managers: UserManagers;

//   constructor() {
//     this.managers = new UserManagers();
//   }

//   async getUser(req: any, res: any) {
//     const user = await this.managers.getUser(req.params.email);
//     res.send(user);
//   }

//   async getEmployers(req: any, res: any) {
//     const response = await this.managers.getEmployers(req.query.email);
//     res.send(response);
//   }

//   async getServiceProviders(req: any, res: any) {
//     const email = req.query.email;
//     const serviceProviders = await this.managers.getServiceProviders(email);
//     res.send(serviceProviders);
//   }

//   async checkUserExists(req: any, res: any) {
//     const user = await this.managers.getUser(req.params.email);
//     user ? res.status(200).send(user) : res.sendStatus(400);
//   }

//   async searchEmail(req: any, res: any) {
//     // try {
//     //   const { receiver, sender } = req.query;
//     //   const senderId = await this.managers.getUserId(sender);
//     //   const isRequestDuplicate = await this.managers.emailHasBeenSent(
//     //     receiver,
//     //     senderId
//     //   );
//     //   if (isRequestDuplicate) {
//     //     throw new Error("You cannot send the request multiple times");
//     //   } else {
//     //     const user = await this.managers.getUser(receiver);
//     //     user
//     //       ? res.status(200).send(user)
//     //       : res.status(200).send("Email not found");
//     //   }
//     // } catch (err) {
//     //   res.status(400).send({ error: err.message });
//     // }
//   }

//   async sendRequest(req: any, res: any) {
//     // try {
//     //   const { sender, receiver } = req.body;
//     //   const senderId = await this.managers.getUserId(sender.email);
//     //   if (req.body.hasOwnProperty("request")) {
//     //     const { request } = req.body;
//     //     await this.managers.storeRequest(receiver, senderId, request);
//     //     await this.managers.sendRequestViaEmail(receiver, sender, request);
//     //     res.sendStatus(200);
//     //   } else {
//     //     await this.managers.storeRequest(receiver, senderId, null);
//     //     await this.managers.sendRequestViaEmail(receiver, sender, null);
//     //     res.sendStatus(200);
//     //   }
//     // } catch (err) {
//     //   res.status(400).send({ error: err });
//     // }
//   }

//   async editServiceProvider(req: any, res: any) {
//     const response = await this.managers.editServiceProvider(req.body);
//     response ? res.sendStatus(200) : res.sendStatus(400);
//   }

//   async deleteServiceProvider(req: any, res: any) {
//     const { epEmail, spEmail } = req.query;
//     const response = await this.managers.deleteServiceProvider(epEmail, spEmail);
//     response ? res.sendStatus(200) : res.sendStatus(400);
//   }

//   async recordTime(req: any, res: any) {
//     const response = await this.managers.recordTime(req.body);
//     res.send(response);
//   }

//   async getTodaysRecord(req: any, res: any) {
//     const record = await this.managers.getTodaysRecord(req.query);
//     res.send(record);
//   }

//   async getRecordByPeriod(req: any, res: any) {
//     const records = await this.managers.getRecordByPeriod(req.query);
//     res.send(records);
//   }

//   async getRecordByDay(req: any, res: any) {
//     const record = await this.managers.getRecordByDay(req.query);
//     res.send(record);
//   }

//   async checkRecordDuplicate(req: any, res: any) {
//     const isDuplicated = await this.managers.checkRecordDuplicate(req.query);
//     isDuplicated ? res.sendStatus(400) : res.sendStatus(200);
//   }

//   async getNotification(req: any, res: any) {
//     const { receiver } = req.query;
//     const notification = await this.managers.getNotification(receiver);
//     res.send(notification);
//   }

//   async updateRequest(req: any, res: any) {
//     try {
//       const { sender, receiver, isApproved, request } = req.body;
//       await this.managers.updateRequest(sender, receiver, isApproved);
//       if (isApproved) {
//         await this.managers.acceptRequest(sender, receiver, request);
//       }
//       res.sendStatus(200);
//     } catch (err) {
//       res.status(400).json({ error: err });
//     }
//   }
// }

// export default UserControllers;
