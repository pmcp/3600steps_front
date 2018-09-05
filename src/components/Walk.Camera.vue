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
    <div  v-if="countdown > 0" class="waiting container" v-bind:style="{ opacity: countdown/30-.2 }">
        <div style="position:relative;top:-25%;" v-html="copy[8][user.language]" @click.alt="edit(copy[8])"></div>
      </div>
    <vue-circle :progress="progressUpload" :size="80" :reverse="false" line-cap="butt" :fill="fill" empty-fill="#000" :animation-start-value="1" :start-angle="0" insert-mode="prepend" :thickness="10" :show-percent="false" @vue-circle-progress="progress" @vue-circle-end="progress_end" ref="uploadCircle">
    </vue-circle>
  </div>
</template>



<script>
  import {storageRef} from '../firebase';
  import VueCircle from 'vue2-circle-progress';  
  import { ImageUploader } from 'vue-image-upload-resize'
  
  export default {
    props: ['lastPicture', 'copy', 'user', 'database'],
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

      // upload(formData) {
        
      //   const photos = formData.getAll('photos');
      //   const promises = photos.map((x) => this.uploadToFirebase(x)
      //   .then(url => ({
      //     fileName: x.name,
      //     url: url
      //   })));
        
      //   return Promise.all(promises);
      // },

  

       uploadToFirebase(file) {
        
          let vm = this;
          return new Promise((resolve, reject) => {
            console.log(file)
            // const fReader = new FileReader();
            // fReader.onload = () => {
              
                var uploadTask = storageRef.child('uploads/' + Date.now() + '-' + file.name).put(file);
                uploadTask.on('state_changed', function(snapshot){
                  
                    let progressUpload = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    vm.$refs.uploadCircle.updateProgress(progressUpload);
                    }, function(error) {
                        console.log(error);
                        reject(error);
                    }, function() {
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                      vm.$refs.uploadCircle.updateProgress(0);
                      resolve(downloadURL);
                    });
                });
            // };
            // fReader.readAsDataURL(file);
          })
        },



      // uploadToFirebase(file) {
        
      //     let vm = this;
      //     return new Promise((resolve, reject) => {
      //       const fReader = new FileReader();
      //       fReader.onload = () => {
              
      //           var uploadTask = storageRef.child('uploads/' + Date.now() + '-' + file.name).put(file);
      //           uploadTask.on('state_changed', function(snapshot){
                  
      //               let progressUpload = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      //               vm.$refs.uploadCircle.updateProgress(progressUpload);
      //               }, function(error) {
      //                   console.log(error);
      //                   reject(error);
      //               }, function() {
      //               uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      //                 vm.$refs.uploadCircle.updateProgress(0);
      //                 resolve(downloadURL);
      //               });
      //           });
      //       };
      //       fReader.readAsDataURL(file);
      //     })
      //   },

 

      save(file) {
        
        let vm = this;
        
          this.uploadToFirebase(file)
          .then(url => ({
            fileName: file.name,
            url: url
          }))
          .then(x => {
            let url = x.url;
            let date = new Date();
            let now = date.getTime();
            let filePath = vm.database + '/' + now;
            
            let data = {
              filePath,
              url
            };
            vm.$emit('uploaded', data);
  
          })
          .catch(err => {
            this.uploadError = err.response;
          });
      },
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
