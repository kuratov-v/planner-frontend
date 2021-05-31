import moment from "moment";

export function getToday() {
    const today = new Date();
    return (
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate()
    );
}

export function getFirstDayOfMonth() {
    var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    return (
        firstDay.getFullYear() +
        "-" +
        (firstDay.getMonth() + 1) +
        "-" +
        firstDay.getDate()
    );
}

export function getLastDayOfMonth() {
    const date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
    const lastDay = new Date(y, m + 1, 0);
    return (
        lastDay.getFullYear() +
        "-" +
        (lastDay.getMonth() + 1) +
        "-" +
        lastDay.getDate()
    );
}

export function getStringDate(date) {
    if (!date) return "";
    var today = new Date();
    var tomorrow = new Date();
    var taskDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);
    if (taskDate.getTime() == today.getTime()) return "Сегодня";
    if (taskDate.getTime() == tomorrow.getTime()) return "Завтра";
    return moment(String(date)).format("DD.MM.YY");
}
