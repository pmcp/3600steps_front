'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');




const mkdirp = require('mkdirp-promise');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage({
  projectId: 'steps-staging',
  keyFilename: 'service-account-credentials.json'
});

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');

const visionClient = new vision.ImageAnnotatorClient();

const bucketId = 'steps-staging.appspot.com';
const bucket = gcs.bucket(bucketId);

function getVisionParameters(gcsUrl) {
  let visionReq = {
    image: {
      source: {
        imageUri: gcsUrl,
      },
    },
    features: [
      {
        type: 'IMAGE_PROPERTIES',
      },
      {
        type: 'LABEL_DETECTION',
      },
      {
        type: 'TEXT_DETECTION',
      },
      {
        type: 'FACE_DETECTION',
      },
      {
        type: 'LANDMARK_DETECTION',
      },
      {
        type: 'LOGO_DETECTION',
      },
      {
        type: 'SAFE_SEARCH_DETECTION',
      },
      // Other detection types here...
    ],
  };
  return visionClient.annotateImage(visionReq);
}

// function downloadFile(filePath, tempLocalFile) {
  
//   bucket.file(filePath).download({ destination: tempLocalFile })
//     .then((result) => {
//       console.log(result);
//       return tempLocalFile;
//     })
// }

// function createRandomFileName(filePath) {
//   return path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex') + path.extname(filePath));
// }

function uploadToBucket(filePath, mime) {
  const metadata = {
    'contentType': mime,
    'Cache-Control': 'publi,max-age=3600',
  };
  
  return bucket.upload(filePath, {
    destination: filePath,
    metadata: metadata,
  })
}

function getGcsUrl(filePath) {
  const bucket = gcs.bucket(bucketId);
  const gcsUrl = 'gs://' + bucketId + '/' + filePath;
  return gcsUrl;
}

function updateFirebase(path, data) {
  const ref = admin.database().ref(path);
  ref.set(data);
}





function resizeProcess(tempFile, filePath, mime, key, sizeName, sizeValue) {
  const resizedFile = path.join(os.tmpdir(), sizeName, filePath);
  const tempLocalResizedDir = path.dirname(resizedFile);

  return Promise.resolve()
  .then(() => {
    console.log('4')
    return mkdirp(tempLocalResizedDir);
  })
  .then(() => {
    console.log('5')
    return spawn('convert', [tempFile, '-scale', sizeValue, resizedFile], {capture: ['stdout', 'stderr']});
  })
  .then((result) => {
    console.log('6')
    console.log(result);
    return uploadToBucket(resizedFile, mime);
  })
  .then((result) => {
    const uploadedFile = bucket.file(resizedFile);
    return uploadedFile.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });
  })
  .then((result) => {
    console.log('7', result[0]);
    updateFirebase('data/images/' + key + '/' + sizeName, result[0]);    
    return
  })
  .then((result) => {
    fs.unlinkSync(resizedFile);
    admin.database().ref('functions/vision/' +  snapshot.key ).remove();
    return;
  })  
}

// Exports are the functions called in the Firebase Functions. Above are helper functions.


// See what Google Vision sees
exports.getVision = functions.database
.ref('functions/vision/{newImage}')
.onCreate((snapshot, context) => {
  const data = snapshot.val();
  const gcsUrl = getGcsUrl(data.fileName)
  return Promise.resolve()
  .then(() => {
    return getVisionParameters(gcsUrl);
  })
  .then((visionData) => {
    console.log('visionData', visionData);
    visionData = visionData[0];
    visionData.imageKey = data.key;
    console.log('visionData after added key', visionData);
    return admin.database().ref('data/vision').push(visionData)
  })
  .then((snapshot) => {
    console.log('the key', snapshot.key);
    updateFirebase('data/images/' + data.key + '/vision', snapshot.key);
    return
  })
})

// exports.resizeImage= functions.database
// .ref('functions/resize/{newImage}')
// .onCreate((snapshot, context) => {
//   const data = snapshot.val();  
//   const resizes = data.resizes;
//   const tempLocalFile = path.join(os.tmpdir(), data.fileName);
//   const tempLocalDir = path.dirname(tempLocalFile);
//   const file = bucket.file(data.fileName);

//   return Promise.resolve()
//   .then(() => {
//     const file = bucket.file(data.fileName);
//     return mkdirp(tempLocalDir);
//   })
//   .then(() => {
//     return file.download({destination: tempLocalFile});
//   })
//   .then(() => {
//     var promises = [];
//     for (var property in resizes) {
//       if (resizes.hasOwnProperty(property)) {
//         let promise = resizeProcess(tempLocalFile, data.fileName, data.mime, data.key, resizes[property].name, resizes[property].size)
//         promises.push(promise);
//       }
//     }
//     return $q.all(promises);
//   })
//   .then(() => {
//     admin.database().ref('functions/resize/' +  snapshot.key ).remove();
//     fs.unlinkSync(tempLocalFile);
//     return; 
//   });
// })


function postToUploadCare(uid, func) {
  rp('https://ucarecdn.com/' + uid + func)
    .then((result) => {
      console.log('in function', result)
      return result
    })
    .catch((err) => {
      console.log('in function', err)
      return err
    });
}


exports.getColor= functions.database
.ref('functions/colors/{newImage}')
.onCreate((snapshot, context) => {
  const data = snapshot.val();
  return rp('https://ucarecdn.com/' + data.image.uuid + '/-/preview/-/main_colors/')
  .then((result) => {
    console.log('in function', result)
    return result
  })
  .catch((err) => {
    console.log('in function', err)
    return err
  });


  // return postToUploadCare(data.image.uuid, '/-/preview/-/main_colors/')
  // .then((result) => {
  //   console.log('in main', result)
  //   return result
  // })
  // .then((snapshot) => {
  //   console.log('the key', snapshot.key);
  //   updateFirebase('data/images/' + data.key + '/colors', snapshot.key);
  //   admin.database().ref('functions/colors/' +  snapshot.key ).remove();
  //   return snapshot
  // })
  
  // rp('https://ucarecdn.com/' + data.image.uuid + '/-/preview/-/main_colors/')
  //   .then((result) => { 
  //     let array = {
  //       result: result,
  //       image: data.key
  //     };
  //     // let res = {colors: {result}, image: data.key}
  //     return admin.database().ref('data/colors').push(array)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //     admin.database().ref('functions/errors/').push(data)
  //     return 
  //   })
})