function $(selector) {
  return document.querySelector(selector)
}

function registration() {
  $('.result_btn').addEventListener('click', () => {
    let first_number = Number($('.first_number').value),
      second_number = Number($('.second_number').value),
      algorithm = $('select').value

    let message = [first_number, second_number, algorithm]

    sendMessage(message).then(result => {
      $('.result').innerHTML = result
    })
  })
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    let messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log(event.data);
  });

  navigator.serviceWorker.register('sw.js')
    .then(() => {
      return navigator.serviceWorker.ready;
    })
    .then(registration)
    .catch(error => {
      console.log(error);
    });
}