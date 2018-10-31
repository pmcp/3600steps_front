
<template>
    <div>
      
      <!--
          First we check if the language is set. We check if the user exists, and if so, we set the language according to his preferences.

          If the user is not set, we set the language to NL. While this process is ongoing, we show a loading indicator.

       -->
      <div v-if="!languageSet" style="width:100%;height:100%;position:absolute;top:0;display:flex;justify-content: center;align-items: center;" >
        <svg width="100" height="100" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#bde0e1">
            <g fill="none" fill-rule="evenodd" stroke-width="2">
                <circle cx="22" cy="22" r="1">
                    <animate attributeName="r"
                        begin="0s" dur="1.8s"
                        values="1; 20"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.165, 0.84, 0.44, 1"
                        repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity"
                        begin="0s" dur="1.8s"
                        values="1; 0"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.3, 0.61, 0.355, 1"
                        repeatCount="indefinite" />
                </circle>
                <circle cx="22" cy="22" r="1">
                    <animate attributeName="r"
                        begin="-0.9s" dur="1.8s"
                        values="1; 20"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.165, 0.84, 0.44, 1"
                        repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity"
                        begin="-0.9s" dur="1.8s"
                        values="1; 0"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.3, 0.61, 0.355, 1"
                        repeatCount="indefinite" />
                </circle>
            </g>
        </svg>
      </div>

      <!--
          Here the language is set. We don't show the loader anymore.
       -->
      <div v-if="languageSet" style="width:100%;height:100%;position:absolute;top:0;display:flex;justify-content: center;align-items: center;" >
      <!--
          If the user doesn't exist, we assume it is the first time the user visits the walk, so we show the instructions.
       -->
        <div v-if="instructions && activeWalk != null" style="width: 100%;height: 100%;position: relative;top: 0;" >
          <div v-if="instructions && user.started != null" class="icon" v-on:click="instructions = !instructions">
            <a class="delete is-medium"></a>
          </div>
          <instructions :user="user" :copy="copy" :slides="slides" v-on:close="instructions = !instructions" v-on:saveUser="saveUser" />
        </div>

        <!--
          If the walk doesn't exist, we give an error message.
       -->
        <div v-if="activeWalk == null" class="container" v-html="copy[4][user.language]" >
        </div>
        <!-- <div v-if="userId === null && user.language !== null">
        </div> -->

        <!--
          If the user is set, we don't need to start with the instructions, so we just show the camera.
       -->
        <div v-if="userId !== null && activeWalk != null" >
          <!--
              If the user toggles the instructions, we hide the camera.
           -->
          <div  v-if="!instructions">
            <!--
                  If the user has taken less pictures than the maximum allowed, we'll show a sentence stating how much the user can still take.
            -->
            <div v-if="user.pictures < maxPictures ">
              <div class="icon" v-if="!instructions && user.started != null" v-on:click="instructions = !instructions">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
              </div>
              <Camera :copy="copy" :user="user" v-if="user.pictures < maxPictures " v-on:uploaded="fileUploaded" :lastPicture="user.lastPicture" />
              <!--
                  If the user is set, we don't need to start with the instructions, so we just show the camera
              -->
              <div style="width:100%;height: 100%;position:absolute;top: 0;left: 0;">
                <div style="position:relative;top:60%;display:flex;justify-content: center;align-items: center;" v-if="user.pictures < maxPictures ">
                  <div v-html="copy[6][user.language]"></div>
                  <div style="padding:5px;">{{maxPictures -user.pictures}}</div>
                  <div v-html="copy[7][user.language]"></div>
                </div>
              </div>
            </div>
              <!--
                    If the user has taken the maximum pictures allowed, we'll show a sentence stating that the walk is finished
              -->
              <div style="width:100%;height: 100%;position:absolute;top: 0;left: 0;">
                <div style="position:relative;top:40%;align-text: center;width:100%;padding-left:2rem;padding-right:2rem;" v-if="user.pictures === maxPictures" v-html="copy[5][user.language]">
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import Camera from '../components/Walk.Camera.vue';
import Instructions from '../components/Walk.Instructions.vue';




function checkWalk (id) {
  return new Promise((resolve, reject) => {
    // Check if walk exists and if it started less than 24h ago
    db
    .ref('data/walks')
    .orderByChild('id')
    .equalTo(id)
    .once('value')
    .then(function (snapshot) {
      const value = snapshot.val();
      if (value) {
        console.log('got snapshot', value)
        console.log('got walk data', value)
        if (value === null) {
          resolve(null);
        } else {
          snapshot.forEach(function(index) {
            console.log('got walk key', index.key)
            resolve(index.key);
          });
        }
      } else {
      reject;
      }
    });
  });
}

function getSeconds() {
  let date = new Date();
  let seconds = date.getTime();
  return seconds;
}

export default {
  name: 'Walk',
  data() {
    return {
      languageSet: false,
      maxPictures: 36,
      userId: null,
      user: {
        lastPicture: 0,
      },
      instructions: true,
      copy: {},
      activeWalk: null,
    };
  },
  components: {
    Camera,
    Instructions
  },
  metaInfo: {
      title: 'walk',
    },
  firebase: {
      copy: {
        source: db.ref('/admin/copy'),
        readyCallback: function() {
          this.languageSet = true;
        },
      },
      slides: db.ref('/admin/slides'),
    },
  methods: {
    // This should completely go to fb functions
    fileUploaded(data) {
      console.log(data);
      if (this.userKey === null) {
        // No user key is set, user does not exist
      } else {
        // User key is set, user exist, add one to number of pictures
        let userPicturesRef =  db.ref('data/users').child(this.userId + '/pictures');
        userPicturesRef.transaction(function(pictures) {
          return pictures + 1;
        });
        let userTakenTimeRef = db.ref('data/users').child(
          this.userId + '/lastPicture'
        );
        userTakenTimeRef.transaction(function() {
          return getSeconds();
        });
      }

      db.ref('data/pictures').push({
        url: data.url,
        dateAdded: getSeconds(),
        user: this.$storage.get('userKey'),
        walk: this.activeWalk,
        filePath: data.filePath,
        mime: data.mime
      }).then((result) => {
        // Also put this in the queue for Vision
        db.ref('data/functions/vision').push({
          url: data.url,
          dateAdded: getSeconds(),
          user: this.$storage.get('userKey'),
          walk: this.activeWalk,
          filePath: data.filePath,
          mime: data.mime,
          key: result.key
        });

        // Also put this in the queue for image Resizing
         db.ref('data/functions/resize').push({
          filePath: data.filePath,
          mime: data.mime,
          resizes: {
            'small': {
              'name': 'small',
              'size': '25%'
            },
            'thumb': {
              'name': 'thumb',
              'size': '5%'
            }
          },
          key: result.key
        });
        return;
      })
    },


    getUser: function(userId) {
      this.$bindAsObject(
        'user',
        db.ref('data/users').child(userId),
        null,
        () => {
          this.userId = userId;
          this.instructions = false;
        }
      );
    },

    saveUser: function(user) {
      let newUser = db.ref('data/users').push({
        started: getSeconds(),
        pictures: 0,
        walk: this.activeWalk,
        user: user,
        lastPicture: 0,
        language: user.language,
      });
      this.$storage.set('userKey', newUser.key, 1000 * 3000);
      this.getUser(newUser.key);
    },
  },

  created: function() {
    let vm = this;
    // Get The UserId out of local storage. If it is not in there, set the language to dutch.
    this.$storage.remove('userKey');
    const userId = vm.$storage.get('userKey');
    if (userId === null) {
      vm.user = {
        language: 'nl',
      };
    } else {
      vm.getUser(userId);
    }
    checkWalk(this.$route.params.id)
    .then(function(result){
      vm.activeWalk = result;
    });

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon {
  position: absolute;
  margin: 10px;
  right: 0;
  top: 0;
  z-index: 1500;
  width: 32px;
  height: 32px;
}
</style>
