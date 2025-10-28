const referenceBedTime = DateInTimeZone(2025, 11, 1, 4, 0, 0, "Europe/Budapest");

const sleepLengthInHours = 8;

window.onerror = function (msg, url, line, col, error) {
  alert("JS Error:\n" + msg + "\n" + url + ":" + line);
};

window.onload = function() 
{ 
    const now = new Date();

    SetDatePicker(now);
    RefreshToday(now);
    RefreshFutureDates(now)
};

function SetDatePicker(now)
{
    const input = document.getElementById("datePicker");

    input.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    input.addEventListener("change", () => RefreshFutureDates(new Date(input.value)));
}

function RefreshFutureDates(date)
{
    const element = document.getElementById('future');
    element.innerHTML = '';

    var futureDate = DateInTimeZone(date.getFullYear(),date.getMonth()+1,date.getDate(),0,0,0,"Europe/Budapest");

    element.innerHTML+= GenerateFutureBox(addHours(futureDate,-24));
    element.innerHTML+= GenerateFutureBox(futureDate);
    element.innerHTML+= GenerateFutureBox(addHours(futureDate,24));
}

function RefreshToday(now)
{
    var times = GetWakeUpAndBedTime(now);

    SetAwake(times.WakeUpTime);
    SetAwakeDate(times.WakeUpTime);

    SetBedTime(times.Bedtime);
    SetBedTimeDate(times.Bedtime);

    var awakeTime = DiffToHourMin(now - times.WakeUpTime);

    SetAwakeTime(awakeTime);
    SetTimeToBed(DiffToHourMin(times.Bedtime-now));

    if(awakeTime.Sleeping)
    {
        SetFeelsLike({ Hour: ((7-(awakeTime.Hour))+((30- awakeTime.Min)>59?1:0))%24, Min: (30- awakeTime.Min)%60})
    }
    else
    {
        SetFeelsLike({ Hour: ((7+(awakeTime.Hour))+((30+ awakeTime.Min)>59?1:0))%24, Min: (30+ awakeTime.Min)%60})
    }
}

function GetWakeUpAndBedTime(date)
{
    const dayDiff = Math.floor((date - referenceBedTime) / (1000 * 60 * 60 * 24));

    var bedTime = addHours(referenceBedTime,(dayDiff+1)*25);
    var wakeUpTime = addHours(bedTime,-(25-sleepLengthInHours));

    return { Bedtime: bedTime, WakeUpTime:wakeUpTime};
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
const SetElementToDate = (id,date)=>SetElementTo(id,`(${FormatDate(date)})`);
const SetElementToTimeSpan = (id,timeSpan)=>SetElementTo(id,`${timeSpan.Sleeping?"-":""}${FormatTime(timeSpan.Hour,timeSpan.Min)}`);
const SetElementToHourMin = (id,time)=>SetElementTo(id,FormatTimeAndZone(time));

const FormatTime=(hour,min) =>`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
const FormatTimeAndZone=(time) =>`${FormatTime(time.getHours(),time.getMinutes())} ${GetTimezone(time)}`
const FormatDate=(date) =>`${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,"0")}.${String(date.getDate()).padStart(2,"0")}`;

const addHours = (date, hours) => new Date(date.getTime() + hours*60*60*1000);

function DateInTimeZone(year, month, day, hour, minute, second, timeZone) 
{
    month = month-1;
    const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
    const tzOffset = new Date(utcDate.toLocaleString("en-US", { timeZone })).getTimezoneOffset();

    return new Date(Date.UTC(year, month, day, hour, minute + tzOffset, second));
}

function GetTimezone(date) {
  const offset = -date.getTimezoneOffset();
  console.log(offset)
  if (offset == 60) return "CET";
  if (offset == 120) return "CEST";
  return "UTC";
}

function GenerateFutureBox(date)
{
    var times = GetWakeUpAndBedTime(date);

    return `<div class="home-container23">
              <span id="futureDate0" class="home-text33">${FormatDate(date)}</span>
              <div class="home-container24">
                <div class="home-container25">
                  <div class="home-container26">
                    <span class="home-text34">
                      <span>Wake up time</span>
                      <br />
                    </span>
                  </div>
                  <div class="home-container27">
                    <span id="futureWake0" class="home-text37">${FormatTimeAndZone(times.WakeUpTime)}</span>
                    <span id="futureWakeDate0" class="home-text38">(${FormatDate(times.WakeUpTime)})</span>
                  </div>
                </div>
                <div class="home-container28">
                  <div class="home-container29">
                    <span class="home-text39">
                      <span>Bed time</span>
                      <br />
                    </span>
                  </div>
                  <div class="home-container30">
                    <span id="futureBedTime0" class="home-text42">${FormatTimeAndZone(times.Bedtime)}</span>
                    <span id="futureBedTimeDate0" class="home-text43">(${FormatDate(times.Bedtime)})</span>
                  </div>
                </div>
              </div>
            </div>`;
}
