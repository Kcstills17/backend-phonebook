

let time = new Date 


const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

const days = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};


function getDayAndMonth(numDay, numMonth) {
  return [days[numDay].slice(0, 3), months[numMonth].slice(0, 3)]
}

function getGMTOffset() {
  const offset = -new Date().getTimezoneOffset(); // in minutes, inverted to match GMT sign
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const minutes = String(absOffset % 60).padStart(2, '0');
  return `GMT${sign}${hours}${minutes}`;
}

function formatDate() {
  const dayAndMonth= getDayAndMonth(time.getDay(), time.getMonth())
  const year = time.getUTCFullYear()
  const hour= time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()


  return `${dayAndMonth[0]} ${dayAndMonth[1]} ${year} ${hour}:${minutes}:${seconds} ${getGMTOffset() } Eastern United States Time`
}





module.exports =  {formatDate}