importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
  if (event.tag === ' register') {
    // call method
    event.waitUntil(getDataAndSend());
  }
});

function addData(userName) {
  //indexDb
  let obj = {
    name: userName,
  };
  fetch('http://localhost:3000/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}

function getDataAndSend() {
  let db;
  const request = indexedDB.open('my-db');
  request.onerror = (event) => {
    console.log('Please allow my web app to use IndexedDB 😃>>>👻');
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    getData(db);
  };
}

function getData(db) {
  const transaction = db.transaction(['user']);
  const objectStore = transaction.objectStore('user');
  const request = objectStore.get('UserData');
  request.onerror = (event) => {
    // Handle errors!
  };
  request.onsuccess = (event) => {
    // Do something with the request.result!
    addData(request.result);
    console.log('Name of the user is ' + request.result);
  };
}
