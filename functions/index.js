'use strict';

const functions = require('firebase-functions');
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

function downloadFile(filePath, tempLocalFile) {
  return bucket.file(filePath).download({ destination: tempLocalFile })
    .then(() => {
      return tempLocalFile;
    })
}

function createRandomFileName(filePath) {
  return path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex') + path.extname(filePath));
}

function uploadToBucket(file, path, mime) {
  const metadata = {
    'contentType': mime,
    'Cache-Control': 'publi,max-age=3600',
  };
  
  return bucket.upload(file, {
    destination: path,
    metadata: metadata,
  })
}

function getGcsUrl(filePath) {
  const bucket = gcs.bucket(bucketId);
  const gcsUrl = 'gs://' + bucketId + '/' + filePath;
  return gcsUrl;
}

function addToFunctionQueue(typeOfFunction, data) {
  return admin
  .database()
  .ref('functions/' + typeOfFunction)
  .push(data).then((snapshot) => {
    return snapshot.key;
  });
}

function saveToFirebase(path, data) {
  admin
    .database()
    .ref(
      'data/images/' +
      path
    )
    .set(data);
}

function updateFirebase(path, data) {
  const ref = admin
              .database()
              .ref(
              'data/images/' +
              path
              );
  ref.set(data);
}

function resizeProcess(newFileName, localFile, extension, file, mime, key, sizeName, sizeValue) {
  const localFileResized = newFileName + '_' + sizeName + extension;
  const resizedPath = sizeName + '/' + localFileResized;

  return Promise.resolve()
  .then(() => {
    return spawn('convert', [file, '-scale', sizeValue, localFileResized], {capture: ['stdout', 'stderr']});
  })
  .then((result) => {
    return uploadToBucket(localFileResized, resizedPath, mime);
  })
  .then((result) => {
    const uploadedFile = bucket.file(resizedPath);
    return uploadedFile.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });
  })
  .then((result) => {
    return updateFirebase(key + '/' + sizeName, result[0]);
  })
  .then((result) => {
    fs.unlinkSync(localFile);
    fs.unlinkSync(localFileResized);
    return;
  })  
}

// Exports are the functions called in the Firebase Functions. Above are helper functions.


// See what Google Vision sees
exports.getVision = functions.database
.ref('functions/vision/{newImage}')
.onCreate((snapshot, context) => {
  const data = snapshot.val();
  const gcsUrl = getGcsUrl(data.filePath)
  return Promise.resolve()
  .then(() => {
    return getVisionParameters(gcsUrl);
  })
  .then(([visionData]) => {
    return updateFirebase(data.key + '/meta/vision', visionData);
  })
})

exports.resizeImage= functions.database
.ref('functions/resize/{newImage}')
.onCreate((snapshot, context) => {
  const data = snapshot.val();
  const extension = '.' + /[^/]*$/.exec(data.mime)[0];
  const newFileName = createRandomFileName(data.filePath);
  const localFile = newFileName + extension
  const resizes = data.resizes;

  return Promise.resolve()
  .then(() => {
    return downloadFile(data.filePath, localFile);
  })
  .then((result) => {  
    for (var property in resizes) {
      if (resizes.hasOwnProperty(property)) {
        resizeProcess(newFileName, localFile, extension, result, data.mime, data.key, resizes[property].name, resizes[property].size)
      }
    }
    admin.database().ref('functions/resize/' +  snapshot.key ).remove();
    return; 
  });
})
