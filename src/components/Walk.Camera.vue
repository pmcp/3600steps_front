<template>
  <div class="takePicture">

  <div >
        <image-uploader style="opacity: 0;z-index: 400;position: absolute; height:100%; width:100%; left:0; top:0;"
        :debug="1"
        :maxWidth="1000"
        :quality="0.8"
        :autoRotate=true
        outputFormat="blob"
        :preview=false
        capture="environment"
        @input="save"
    >
    
    <label for="fileInput" slot="upload-label" style="opacity: 0;z-index: 400;position: absolute; height:100%; width:100%; left:0; top:0;">
      </label>
      </image-uploader>



  </div>
    <!-- If the last taken picture is less than 30 seconds ago, the user can't upload anything, untill time is over (freaky age) -->
    <!-- <div  v-if="countdown > 0" class="waiting container" v-bind:style="{ opacity: countdown/30-.2 }">
        <div style="position:relative;top:-25%;" v-html="copy[8][user.language]" @click.alt="edit(copy[8])"></div>
      </div> -->
    <vue-circle :progress="progressUpload" :size="80" :reverse="false" line-cap="butt" :fill="fill" empty-fill="#000" :animation-start-value="1" :start-angle="0" insert-mode="prepend" :thickness="10" :show-percent="false" @vue-circle-progress="progress" @vue-circle-end="progress_end" ref="uploadCircle">
    </vue-circle>
  </div>
</template>


<script>
  import {storageRef} from '../firebase';
  import VueCircle from 'vue2-circle-progress';  
  import { ImageUploader } from 'vue-image-upload-resize'
  import uploadcare from 'uploadcare-widget'

  export default {
    props: ['lastPicture', 'copy', 'user'],
    data() {
      return {
        uploadedFiles: [],
        uploadError: null,
        uploadFieldName: 'photos',
        progressUpload: 0,
        fill: {
          color: '#0091AA',
        },
        countdown: 0,
        last: 0,
      };
    },
  
    computed: {
      reverseFiles() {
        return this.files.slice().reverse();
      }
    },
    components: {
      VueCircle,
      ImageUploader
    },
    methods: {
      reset() {
        // reset form to initial state
        this.uploadedFiles = [];
        this.uploadError = null;
      },


      uploadCare(file) {
        let vm = this;
        return new Promise((resolve, reject) => {
          let uploadFile = uploadcare.fileFrom('object', file, {
            publicKey: '0d8c0c56c0314b2df8b7',
            imagesOnly: true
          });
          uploadFile.done(function(fileInfo) {
            console.log('success', fileInfo)
            vm.$refs.uploadCircle.updateProgress(0);
            resolve(fileInfo);
          }).fail(function(error, fileInfo) {
            vm.$refs.uploadCircle.updateProgress(0);
            console.log(error, fileInfo)
            reject(error);
          });

          uploadFile.progress(function(uploadInfo) {
            console.log(uploadInfo)
            vm.$refs.uploadCircle.updateProgress(uploadInfo.progress * 100);
          });
        })
      },
      
      save(file) {
        let vm = this;
          this.uploadCare(file)
          .then(obj => {
            vm.$emit('uploaded', obj);
          })
          .catch(err => {
            this.uploadError = err;
          });
      },

      // uploadToFirebase(file, path) {
      //   let vm = this;
      //   return new Promise((resolve, reject) => {
      //     var imageRef = storageRef.child(path);
      //     var uploadTask = imageRef.put(file);
      //     uploadTask.on('state_changed', function(snapshot){
      //       let progressUpload = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      //       vm.$refs.uploadCircle.updateProgress(progressUpload);
      //       }, function(error) {
      //           console.log(error);
      //           reject(error);
      //       }, function() {
      //       uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      //         vm.$refs.uploadCircle.updateProgress(0);
      //         resolve(downloadURL);
      //       });
      //     });
      //   })
      // },

      // save(file) {
        
      //   let vm = this;
      //   const mime = file.type;
      //   const extension = /[^/]*$/.exec(mime)[0];
      //   console.log('the mime', file,  mime, extension);
      //   const fileName = Date.now() + '.' + /[^/]*$/.exec(mime)[0];
      //   const filePath = 'user_uploads/original/' + fileName;
      //     this.uploadToFirebase(file, filePath)
      //     .then(url => {
      //       console.log(mime)

      //       const data = {
      //         fileName,
      //         url,
      //         mime
      //       };
      //       console.log(data);
      //       vm.$emit('uploaded', data);
      //     })
      //     .catch(err => {
      //       this.uploadError = err.response;
      //     });
      // },
      filesChange(fieldName, fileList) {

        
        // handle file changes
        const formData = new FormData();
  
        if (!fileList.length) return;
  
        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name);
          });
          // save it
        this.save(formData);
      },
  
      progress() {},
      progress_end() {
        this.progressUpload = 0;
      },
      detectFiles(fileList) {
        Array.from(Array(fileList.length).keys()).map(x => {
          this.upload(fileList[x]);
          return;
        });
      },
  
      doCountdown(last) {
        let vm = this;
        let interval;
        if (last === 0) {
          return
        } else {
          let now = new Date().getTime();
          // Get time left
          vm.countdown = 30 - (now - last) / 1000;
          if (vm.countdown <= 0) {
            vm.countdown = 0;
            clearInterval(interval);
            // time has passed, all good
          } else {
            interval = setInterval(function() {
              vm.countdown = Math.round(vm.countdown - 1);
              if (this.countdown < 0) {
                clearInterval(interval);
              }
            }, 1000);
          }
        }
      },
    },
  
    mounted() {
      this.reset();
    },
  
    watch: {
      lastPicture: function(newVal) {
        console.log(newVal);
        this.doCountdown(newVal);
      },
    },
  };
</script>

<style scoped>
  *:focus {
    outline: none;
  }

  .takePicture {
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .waiting {
    -webkit-transition: opacity 1s ease-in-out;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    opacity: 0;
    z-index: 500;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
