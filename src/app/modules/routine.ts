export class Routine {

    weekday: number;
    dayTime: string;
    type: string;
    timetable: string;
    userID: string;
    completed: boolean;

    constructor(weekday: number, dayTime: string, type: string, timetable: string, userID: string, completed: boolean) {
        this.weekday = weekday
        this.dayTime = dayTime
        this.type = type
        this.timetable = timetable
        this.userID = userID
        this.completed = completed
    }

}