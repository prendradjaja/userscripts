function stod(s) {
  let [y, m, d] = s.split('-').map(x => +x);
  m--;
  return new Date(y, m, d);
}

function dtos_ignore_time(dt) {
  let y = (dt.getFullYear()).toString().padStart(4, '0');
  let m = (dt.getMonth() + 1).toString().padStart(2, '0');
  let d = (dt.getDate()     ).toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}


/**
 * Excludes end date
 *
 *
 * > start = stod('2021-01-01')
 * > end = stod('2021-01-03')
 * > for (let d of date_range(start, end))
 * ... console.log(dtos_ignore_time(d));
 * 2021-01-01
 * 2021-01-02
 */
function date_range(start, end, increment) {
  increment = increment || 1;
  let curr = start;
  const result = [];
  while (curr.getTime() < end.getTime()) {
    result.push(curr);
    curr = add_days(curr, increment);
  }
  return result;
}

/**
 * Returns a new Date n days later.
 */
function add_days(date, n) {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + n);
  return newDate;
}

/**
 * > dtos_ignore_time(startofweek(stod('2021-04-05')))  // Monday becomes Monday
 * 2021-04-05
 * > dtos_ignore_time(startofweek(stod('2021-04-07')))  // Wednesday becomes Monday
 * 2021-04-05
 * > dtos_ignore_time(startofweek(stod('2021-04-11')))  // Sunday becomes Monday
 * 2021-04-05
 * > dtos_ignore_time(startofweek(stod('2021-04-12')))  // Next Monday becomes next Monday
 * 2021-04-12
 */
function startofweek(date) {
  const weekday = date.getDay() - 1;
  return (
    weekday === -1
    ? add_days(date, -6)
    : add_days(date, -weekday)
  );
}

function get_startofyear_from_list(datelist) {
  for (let d of datelist) {
    if (d.getMonth() === 0 && d.getDate() === 1) {
      return d;
    }
  }
  return undefined;
}

function get_startofmonth_from_list(datelist) {
  for (let d of datelist) {
    if (d.getDate() === 1) {
      return d;
    }
  }
  return undefined;
}
