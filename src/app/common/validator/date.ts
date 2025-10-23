import { format } from 'date-fns'

export function setDateFormat(date: Date): string {
    return format(date, 'yyyy-MM-dd')
}