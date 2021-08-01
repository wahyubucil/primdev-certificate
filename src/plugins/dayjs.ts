import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Register dayjs plugin here
dayjs.extend(isSameOrBefore);
