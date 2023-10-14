import ActivityControllers from "../controllers/activityControllers";

class ActivityRoutes {
    activityControllers: ActivityControllers;

    constructor() {
        this.activityControllers = new ActivityControllers();
    }

    applyRouting(app: any) {
        app.post('/activity', this.activityControllers.addActivity.bind(this.activityControllers));
        app.get('/activity/:email/:name', this.activityControllers.getSpecificActivity.bind(this.activityControllers));
        app.get('/activities/:email', this.activityControllers.getActivities.bind(this.activityControllers));
        app.delete('/activity/:email/:name', this.activityControllers.deleteActivity.bind(this.activityControllers));
        app.post('/edit/activity', this.activityControllers.editActivity.bind(this.activityControllers));
    }
}

export default ActivityRoutes;