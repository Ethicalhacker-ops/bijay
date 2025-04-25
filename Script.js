function updateClock() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var date = now.toLocaleDateString();

  // Format the time with leading zeros for single digits
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  // Display the time
  document.getElementById('clock').innerHTML = `${date} ${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);  // Update clock every second
