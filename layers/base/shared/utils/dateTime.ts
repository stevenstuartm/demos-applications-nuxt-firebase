import { DateTime } from "luxon";

/*************************** DATE/TIME Constants *************************/
const MonthDayYearDateFormat: string = 'MMMM d, yyyy';
const DayMonthYearMinimalDateFormat: string = 'ddMMyy';
const YearMonthDayMinimalDateFormat: string = 'yyMMdd';

/*
Reference to the native DateTime function for creating a DateTime in UTC

Examples:
    DateTime. utc()                                            //~> now
    DateTime. utc(2017)                                        //~> 2017-01-01T00:00:00Z
    DateTime. utc(2017, 3)                                     //~> 2017-03-01T00:00:00Z
    DateTime. utc(2017, 3, 12)                                 //~> 2017-03-12T00:00:00Z
    DateTime. utc(2017, 3, 12, 5)                              //~> 2017-03-12T05:00:00Z
    DateTime. utc(2017, 3, 12, 5, 45)                          //~> 2017-03-12T05:45:00Z
    DateTime. utc(2017, 3, 12, 5, 45, { locale: "fr" } )       //~> 2017-03-12T05:45:00Z with a French locale
    DateTime. utc(2017, 3, 12, 5, 45, 10)                      //~> 2017-03-12T05:45:10Z
    DateTime. utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr") //~> 2017-03-12T05:45:10.765Z with a French locale

Params:
    year – — The calendar year. If omitted (as in, call utc() with no arguments), the current time will be used
    month – — The month, 1-indexed
    day – — The day of the month
    hour – — The hour of the day, in 24-hour time
    minute – — The minute of the hour, meaning a number between 0 and 59
    second – — The second of the minute, meaning a number between 0 and 59
    millisecond – — The millisecond of the second, meaning a number between 0 and 999
    options – — configuration options for the DateTime
    Properties:
    locale – — a locale to set on the resulting DateTime instance
    outputCalendar – — the output calendar to set on the resulting DateTime instance
    numberingSystem – — the numbering system to set on the resulting DateTime instance
 */

/**
 * A type definition for simplifying the API of the IDateTimeService
 */
export type DateTimeLike = DateTime | Date | number | string | undefined;

/**
 *
 * @param value
 */
export function normalizeDateTime( value: DateTimeLike | undefined | null ): DateTime {
    let date: DateTime | null = null;

    const valueType: string = typeof value;

    // If the value passed in is not defined, then use the current date
    if ( valueType === 'undefined' ) {
        // If nothing was provided, assign the current date & time (in UTC)
        date = DateTime.utc();
    }
    // If the value passed in is a string, attempt to parse it using standard formats
    else if ( valueType === 'string' ) {
        const dateString: string = value as string;

        // Attempt to parse using the most likely format and move down the list (ISO, RFC2822, HTTP header, give up)
        const isoDate: DateTime = DateTime.fromISO( dateString, { setZone: true } );

        // If the string was successfully parsed as an ISO-compliant string, return it
        if ( isoDate.isValid ) {
            date = isoDate;
        }
        // Otherwise, attempt to parse it as an RFC 2822 string
        else {
            // Attempt to parse using the standard US date format 'MMM dd, yyyy'
            const monthDayYearDateFormat: DateTime = DateTime.fromFormat( dateString, MonthDayYearDateFormat, { setZone: true } );

            if ( monthDayYearDateFormat.isValid ) {
                date = monthDayYearDateFormat;
            } else {
                const isoDate: DateTime = DateTime.fromISO( dateString, { setZone: true } );
                // If the string was successfully parsed as an RFC2822-compliant string, return it
                if ( isoDate.isValid ) {
                    date = isoDate;
                } else {
                    const rfc2822Date: DateTime = DateTime.fromRFC2822( dateString, { setZone: true } );
                    // If the string was successfully parsed as an RFC2822-compliant string, return it
                    if ( rfc2822Date.isValid ) {
                        date = rfc2822Date;
                    }
                    // Otherwise, attempt to parse it as an HTTP header formatted string
                    else {
                        const httpHeaderDate: DateTime = DateTime.fromHTTP( dateString, { setZone: true } );
                        // If the string was successfully parsed as an HTTP-compliant string, return it
                        if ( httpHeaderDate.isValid ) {
                            date = httpHeaderDate;
                        }
                        // else - give up and return the original explicit 'null' value for the date
                    }
                }
            }
        }
    }
    else if ( valueType === 'number' ) {
        const dateFromTimestamp: DateTime = DateTime.fromMillis( value as number ); // .setZone( EasternTimeZone );

        // If the value resolves to a valid DateTime, return it
        if ( dateFromTimestamp.isValid ) {
            date = dateFromTimestamp;
        }
        // else - give up and return the original explicit 'null' value for the date
    }
    // Test to determine if the object passed in is an instance of the native JavaScript Date object
    else if ( value instanceof Date ) {
        date = DateTime.fromJSDate( value ); // .setZone( EasternTimeZone );
    }
    // Test to determine if the object passed in is already an instance of the DateTime object
    else if ( value instanceof DateTime || DateTime.isDateTime( value ) ) {
        date = value; // .setZone( EasternTimeZone );
    }
    else {
        date = DateTime.fromObject( { year: 0, month: 0, day: 0 } );
    }

    return date!;
}

export function fromSortableString( value: string ): DateTime {
    const SortableDateFormat: string = 'yyyy-MM-dd';
    return DateTime.fromFormat( value, SortableDateFormat );
}

export function utcNow(): DateTime {
    return DateTime.utc();
}

export function localNow(): DateTime {
    return DateTime.local();
}

/*----------------------------------------------------------------------------------------------- */
/* ------------------------------------ FORMATTING FUNCTIONS ------------------------------------ */
/*----------------------------------------------------------------------------------------------- */

export function formatDateAsSortableString( value: DateTimeLike, isNormalized: boolean = false ): string {
    const SortableDateFormat: string = 'yyyy-MM-dd';

    let dt: DateTime;
    if ( isNormalized ) {
        dt = value as DateTime;
    } else {
        dt = normalizeDateTime( value );
    }

    return dt?.isValid ? dt.toFormat( SortableDateFormat ) : '';
}

export function formatDateAsMonthDayYearString( value: DateTimeLike | undefined | null, isNormalized: boolean = false ): string {

    let dt: DateTime;
    if ( isNormalized ) {
        dt = value as DateTime;
    } else {
        dt = normalizeDateTime( value );
    }

    return dt.isValid ? dt.toFormat( MonthDayYearDateFormat ) : '';
}

export function formatDateAsISOString( value: DateTimeLike, isNormalized: boolean = false ): string {
    let dt: DateTime;
    if ( isNormalized ) {
        dt = value as DateTime;
    } else {
        dt = normalizeDateTime( value );
    }

    return dt?.isValid ? dt.toISODate()! : '';
}

export function formatDateAsYearMonthDayMinimalString( value: DateTimeLike, isNormalized: boolean = false ): string {
    let dt: DateTime;
    if ( isNormalized ) {
        dt = value as DateTime;
    } else {
        dt = normalizeDateTime( value );
    }

    return dt.isValid ? dt.toFormat( YearMonthDayMinimalDateFormat ) : '';
}

export function formatDateAsDayMonthYearMinimalString( date?: DateTimeLike, isNormalized: boolean = false ): string {
    let dt: DateTime;
    if ( isNormalized ) {
        dt = date as DateTime ?? DateTime.now();
    } else {
        dt = normalizeDateTime( date ?? DateTime.now() );
    }

    return dt.isValid ? dt.toFormat( DayMonthYearMinimalDateFormat ) : '';
}

export function formatDateAsISO8601String( value: DateTimeLike, isNormalized: boolean = false ): string {
    let dt: DateTime;
    if ( isNormalized ) {
        dt = value as DateTime;
    } else {
        dt = normalizeDateTime( value );
    }

    return dt?.isValid ? `${ dt.toISODate()! }${ dt.toISOTime( { includePrefix: true } ) }` : '';
}

export function formatDateAsDayOfWeekMonthDayYearString( value: DateTimeLike | undefined | null, isNormalized: boolean = false ): string {
    let dt: DateTime;
    if ( isNormalized ) {
        dt = value as DateTime;
    } else {
        dt = normalizeDateTime( value );
    }

    return dt.isValid ? dt.toLocaleString( DateTime.DATE_MED_WITH_WEEKDAY ) : '';
}
