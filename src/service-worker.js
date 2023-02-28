importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
  if (event.tag === 'register') {
    // call method
    event.waitUntil(getDataAndSend("register"));
  }else if (event.tag === 'profileUpdate') {
    event.waitUntil(getDataAndSend("profileUpdate"));
  }
});

function addData(data) {
  //indexDb
  
  fetch('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}

function getDataAndSend(type) {
  let db;
  const request = indexedDB.open('my-db');
  request.onerror = (event) => {
    console.log('Please allow my web app to use IndexedDB 😃>>>👻');
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    getData(db,type);
  };
}

function getData(db,type) {
 let table=""
  switch (type) {
    case 'register':
      table='user'
      break;
      case 'profileUpdate':
        table="profile"
      break;
    default:
      break;
  }
  const transaction = db.transaction([table]);
  const objectStore = transaction.objectStore(table);
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
