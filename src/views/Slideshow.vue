<template>
  <div class="container">
    <div>
      <div class="grid" style=" display: flex;flex-direction:row;flex-wrap:wrap;justify-content: space-between">
        <div v-for="(item, index) in imageSelection" v-bind:key="index+'_grid'" style="width:18%;margin-bottom:2rem;" v-bind:style="{'margin-left': Math.floor(Math.random() * 50) + 1  +'px','margin-right': Math.floor(Math.random() * 50) + 1  +'px'  }" >
          <div class="filtered" v-bind:class="classes[Math.floor(Math.random() * 2)]" style="float:left" @click="imageModal(item.full)">
            <img v-if="item.image" class="grid-picture" :src="item.image.uuid | getResized"  >
            <img v-else class="grid-picture" :src="item.url" >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';
import uploadcare from 'uploadcare-widget'

function getSeconds() {
  let date = new Date();
  let seconds = date.getTime();
  return seconds;
}


export default {
  name: 'Slideshow',
  data() {
    return {
      imageSelection: {},
      selectedWalk: null,
      theWalk: null,
      classes: ['red', 'blue'],
      imagesAll: [],
      numberOfPicturesInSelection: 12
    };
  },
  filters: {
    getResized: function(id) {
      var gfilePromise = file.promise();
      groupPromise.done(function(fileGroupInfo) {
        // Upload successfully completed and all files in the group are ready.
      });
      groupPromise.fail(function(error, fileGroupInfo) {
        // Upload failed, or something else went wrong.
      });
      return "https://ucarecdn.com/" + id + "/-/resize/300x/";
    }
  },
  firebase: function() {
    return {
      walks: {
        source: db.ref('data/walks'),
        readyCallback: function() {
          let vm = this;
          vm.getRandom();
        },
      },
    };
  },
  metaInfo: {
      title: 'Home'
    },

  methods: {
    imageModal(url) {
      const randomClass = this.classes[Math.floor(Math.random() * 2)];
      console.log(randomClass);
      this.$modal.open('<div class="filtered ' + randomClass + '" ><img src="' + url + '"></div>');
    },

    getRandom: function() {
        let vm = this;
        Array.prototype.shuffle = function(){
          for (var i = 0; i < this.length; i++){
              var a = this[i];
              var b = Math.floor(Math.random() * this.length);
              this[i] = this[b];
              this[b] = a;
          }
        }
        function shuffleProperties(obj) {
            var new_obj = {};
            var keys = getKeys(obj);
            keys.shuffle();
            keys = keys.slice(0, vm.numberOfPicturesInSelection);
            for (var key in keys){
                if (key == "shuffle") continue; 
                new_obj[keys[key]] = obj[keys[key]];
            }
            return new_obj;
        }
        function getKeys(obj){
            var arr = new Array();
            for (var key in obj)
                // also a small step to check if the picture is hidden, otherwise it shouldnt be in the array
                if(obj[key].hide !== true) {arr.push(key)}
            return arr;
        }
        let walk = vm.theWalk;

      function saveSelection(selection) {
          db.ref('admin/slideshow').push({
              time: getSeconds(),
              images: selection
          });
        }

      db.ref('data/images')
          .once('value', snapshot => {
            let images = snapshot.val();
            window.setInterval(() => {
              vm.imageSelection = shuffleProperties(images);
              console.log('jep')
              saveSelection(vm.imageSelection);
            }, 5000);
          });
    },
      
    filterByWalk: function(walk) {
      let vm = this;
      vm.theWalk = walk;
      if(walk == null) {
        return;
      } else {
      db.ref('data/images')
        .orderByChild('walk')
        .equalTo(walk)
        .once('value', snapshot => {
          vm.imageSelection = snapshot.val();
          vm.getRandom();
        });
      }
    },
  },
};
</script>

<style >
.maintitle {
  font-size: 6vw;
  text-align: center;
}
svg {
  position: absolute;
  top: 0;
  left: 0;
}

.grid {
  width: 100%;
}

.item {
  width: 25%;
  height: auto;
  max-height: 400px;
  padding-bottom: 10px;
}
.blue {
  background: #23427b;
}
.red {
  background: #d02631;
}

.filtered img {
  width: auto;
  mix-blend-mode: screen;
  filter: grayscale(100%) contrast(200%);
  opacity: 1;
  margin-bottom: -6px;
}

.modal-background {
  background-color: RGBA(255, 255, 255, .80)
}
</style>