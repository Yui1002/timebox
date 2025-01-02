interface INotificationController {
    getNotification(request: any, response: any, next: any): Promise<void>;
}

class NotificationController implements INotificationController {
    constructor() {

    }

    public async getNotification(request: any, res: any, next: any): Promise<void> {
        try {

        } catch (e: any) {
            next(e);
        }
    }
}

export default NotificationController;