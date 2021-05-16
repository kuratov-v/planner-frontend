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
