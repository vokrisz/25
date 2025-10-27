const referenceBedTime = DateInTimeZone(2025, 11, 1, 4, 0, 0, "Europe/Budapest");//ToDo back calculation

const sleepLengthInHours = 8;

window.onload = function() 
{ 
    const now = new Date();

    SetDatePicker(now)
    RefreshToday(now);
};

function SetDatePicker(now)
{
    const input = document.getElementById("datePicker");

    input.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    input.addEventListener("change", () => RefreshFutureDates(input.value));
}

function RefreshFutureDates(date)//ToDo
{
    console.log("Selected date:", date);
}

function RefreshToday(now)
{
    const dayDiff = Math.floor((now - referenceBedTime) / (1000 * 60 * 60 * 24));

    var bedTime = addHours(referenceBedTime,(dayDiff+1)*25);
    var wakeUpTime = addHours(bedTime,-(25-sleepLengthInHours));

    SetAwake(wakeUpTime);
    SetAwakeDate(wakeUpTime);

    SetBedTime(bedTime);
    SetBedTimeDate(bedTime);

    var awakeTime = DiffToHourMin(now - wakeUpTime);

    SetAwakeTime(awakeTime);
    SetTimeToBed(DiffToHourMin(bedTime-now));

    if(awakeTime.Sleeping)
    {
        SetFeelsLike({ Hour: ((7-(awakeTime.Hour))+((30- awakeTime.Min)>59?1:0))%24, Min: (30- awakeTime.Min)%60})
    }
    else
    {
        SetFeelsLike({ Hour: ((7+(awakeTime.Hour))+((30+ awakeTime.Min)>59?1:0))%24, Min: (30+ awakeTime.Min)%60})
    }
}

function DiffToHourMin(diff)
{
    let sleeping = false;

    if(diff<0)
    {
        diff=diff*-1;
        sleeping= true;
    }

    const minDiff = diff/((1000 * 60));
    const hour = Math.floor(minDiff / 60);
    const minute = Math.floor(minDiff % 60);

    return { Hour: hour, Min: minute, Sleeping: sleeping};
}

const SetAwake=(time) => SetElementToHourMin('awake',time);
const SetAwakeDate=(date) => SetElementToDate('awakeDate',date);

const SetBedTime=(time)=> SetElementToHourMin('bedTime',time);
const SetBedTimeDate=(date)=> SetElementToDate('bedTimeDate',date);

const SetAwakeTime=(timeSpan) =>SetElementToTimeSpan('awakeTime',timeSpan);
const SetFeelsLike=(timeSpan)=>SetElementToTimeSpan('feelsLike',timeSpan);
const SetTimeToBed=(timeSpan) => SetElementToTimeSpan('timeToBed',timeSpan);

const SetElementTo = (id,text)=>document.getElementById(id).textContent = text;
const SetElementToDate = (id,date)=>SetElementTo(id,FormatDate(date));
const SetElementToTimeSpan = (id,timeSpan)=>SetElementTo(id,`${timeSpan.Sleeping?"-":""}${FormatTime(timeSpan.Hour,timeSpan.Min)}`);
const SetElementToHourMin = (id,time)=>SetElementTo(id,`${FormatTime(time.getHours(),time.getMinutes())} ${GetTimezoneOffsetone(time)}`);

const FormatTime=(hour,min) =>`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
const FormatDate=(date) =>`(${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")})`;

const addHours = (date, hours) => new Date(date.getTime() + hours*60*60*1000);

function DateInTimeZone(year, month, day, hour, minute, second, timeZone) 
{
    month = month-1;
    const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
    const tzOffset = new Date(utcDate.toLocaleString("en-US", { timeZone })).getTimezoneOffset();

    return new Date(Date.UTC(year, month, day, hour, minute + tzOffset, second));
}

function GetTimezoneOffsetone(date) 
{
    const zoneMatch = date.toString().match(/\(([^)]+)\)/);
    const zoneName = zoneMatch ? zoneMatch[1] : "Unknown";

    if (/Central European/.test(zoneName)) {
        if (/Summer/.test(zoneName)) {
        abbr = "CEST";
        } else {
        abbr = "CET";
        }
    }

  return abbr;
}
