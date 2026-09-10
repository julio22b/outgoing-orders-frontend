/** 24-hour throughout: a dispatch record is a log, and AM/PM doesn't align in a column. */
const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

const relativeDay = (date: Date) => {
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return 'Today';

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return dayFormat.format(date);
};

/**
 * Day and time kept apart so they can be set in their own columns and line up
 * down a list, instead of ragging against each other in one string.
 */
export const formatOrderStamp = (isoString: string) => {
    const date = new Date(isoString);
    return { day: relativeDay(date), time: timeFormat.format(date) };
};

export const formatOrderDate = (isoString: string) => {
    const { day, time } = formatOrderStamp(isoString);
    return `${day} ${time}`;
};

export const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
    `${count} ${count === 1 ? singular : plural}`;
