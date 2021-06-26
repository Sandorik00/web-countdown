window.addEventListener('load', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams.entries());
  let b = document.createElement('b');
  let title = document.createTextNode(params['title'] ?? "Sandorik's birthday");
  b.appendChild(title);
  document.getElementById('to').appendChild(b);
  let target_date;
  if (Object.entries(params).length == 0) {
    target_date = {
      month: 5,
      day: 23,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  } else {
    target_date = params;
  }
   
  let current_date = new Date();
  let seconds = current_date.getUTCSeconds();
  let minutes = current_date.getUTCMinutes();
  let hours = current_date.getUTCHours();
  let day = current_date.getUTCDate();
  let month = current_date.getUTCMonth();
  let year = (month > target_date.month || (month == target_date.month && day > target_date.day) || (day == target_date.day && hours > target_date.hours) || (hours == target_date.hours && minutes > target_date.minutes) || (minutes == target_date.minutes && seconds > target_date.seconds)) ? current_date.getUTCFullYear() + 1 : current_date.getUTCFullYear();
  
  const COUNTDOWN_DATE = Date.UTC(year, target_date.month, target_date.day, target_date.hours ?? 0, target_date.minutes ?? 0, target_date.seconds ?? 0);
  if (!COUNTDOWN_DATE) {
    let e = document.createElement('p');
    let text = document.createTextNode('In query parameters you should specify at least \"month\" and \"day\"');
    e.appendChild(text);
    b.appendChild(e);
    return
  }

  let digitsElements = {};
  ['days', 'hours', 'minutes', 'seconds'].forEach((id) => {
    digitsElements[id] = document.querySelector('#' + id + '.number > .digits');
  });

  function update() {
    let millisecondsLeft = COUNTDOWN_DATE - Date.now();
    // Personally, I can't think of an explanation why ceil is used here
    // instead of floor like everywhere else. I determined with some
    // experimentation that this is the right way.
    let secondsLeft = Math.ceil(millisecondsLeft / 1000);
    setNumber('seconds', secondsLeft % 60);
    let minutesLeft = Math.floor(secondsLeft / 60);
    setNumber('minutes', minutesLeft % 60);
    let hoursLeft = Math.floor(minutesLeft / 60);
    setNumber('hours', hoursLeft % 24);
    let daysLeft = Math.floor(hoursLeft / 24);
    setNumber('days', daysLeft);

    requestAnimationFrame(update);
  }

  // basically I have reinvented Virtual DOM here
  function setNumber(id, value) {
    let text = padLeft(value.toString(), 2, '0');
    let digits = digitsElements[id];

    // remove extra elements if needed
    for (let i = digits.childElementCount; i > text.length; i--) {
      digits.removeChild(digits.lastElementChild);
    }

    // add missing elements if needed
    for (let i = digits.childElementCount; i < text.length; i++) {
      let digit = document.createElement('div');
      digit.className = 'digit';
      digits.appendChild(digit);
    }

    for (let i = 0; i < digits.childElementCount; i++) {
      let digit = digits.children[i];
      // only update this digit if needed
      if (text[i] !== digit.textContent) digit.textContent = text[i];
    }
  }

  // ah, the famous left-pad
  function padLeft(string, length, padding) {
    while (string.length < length) string = padding + string;
    return string;
  }

  update();
});
