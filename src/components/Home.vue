<template>
  <div class="container">
    <section class="section">
    <h1 class="maintitle">3600 STEPS</h1>
    </section>
    <section class="section">


      <!-- <div v-for="(i, index) in imagesAll">
        
        <div @click="deleteFB(i)">Delete</div> {{i.dateAdded}} - <img :src="i.url" style="width:100px;height:auto">
      </div> -->

          <b-field style="float:left">
            <b-select placeholder="Choose walk" v-model="selectedWalk"  @input="filterByWalk(selectedWalk['.key'])">
              <option  :value="'Alles'" :key="null">Alles</option>
              <option
                  v-for="(item, index) in walks"
                  :value="item"
                  :key="index">
                  {{ item.id}}
              </option>
            </b-select>
          </b-field>

        <!-- <div style="float:left;width:4rem"  @click="getRandom"> -->

          <div style="width:3rem;float:left;top:-.4rem;position:relative; left:1rem;">
            <img src="../assets/random.svg" alt="random pictures" style="width: 100%; height: auto;" @click="getRandom" >
          </div>

    </section>
    <div>
      <div class="grid" style=" display: flex;flex-direction:row;flex-wrap:wrap;justify-content: space-between">
        <div v-for="(item, index) in imageSelection" v-bind:key="index+'_grid'" style="width:18%;margin-bottom:2rem;" v-bind:style="{'margin-left': Math.floor(Math.random() * 50) + 1  +'px','margin-right': Math.floor(Math.random() * 50) + 1  +'px'  }" >
          <div class="filtered" v-bind:class="classes[Math.floor(Math.random() * 2)]" style="float:left" @click="imageModal(item.url)">
            <img v-if="item.thumb" class="grid-picture" :src="item.thumb" >
            <img v-else class="grid-picture" :src="item.url" >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebase';


// function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }


export default {
  name: 'Home',
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
  props: ['database'],
  firebase: function() {
    return {
      walks: db.ref(this.database + '/walks'),
      // imagesAll: db.ref(this.database + '/images').orderByChild('dateAdded').startAt(1530199962181).limitToFirst(10),
      images: {
        source: db.ref(this.database + '/images'),
        readyCallback: function() {
          this.getRandom();
        },
      },
    };
  },
  metaInfo: {
      title: 'Home'
    },

  methods: {
    // deleteFB(item) {
    //   this.$firebaseRefs.imagesAll.child(item['.key']).remove()
    // },
    imageModal(url) {
      this.$modal.open('<img src="' + url + '">');
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
                arr.push(key);
            return arr;
        }


        let walk = vm.theWalk;



      
      if(walk == null) {
                vm.$firebaseRefs.images
          .once('value', snapshot => {
            let images = snapshot.val();          
            vm.imageSelection = shuffleProperties(images);
          });

      } else {

      
        vm.$firebaseRefs.images
          .orderByChild('walk')
          .equalTo(walk)
          .once('value', snapshot => {
            let images = snapshot.val();          
            vm.imageSelection = shuffleProperties(images);
          });
      }
    },
      
    filterByWalk: function(walk) {
      console.log(walk);
      let vm = this;
      vm.theWalk = walk;
      if(walk == null) {
        return;
        

      } else {
      vm.$firebaseRefs.images
        .orderByChild('walk')
        .equalTo(walk)
        .limitToLast(vm.numberOfPicturesInSelection)
        .once('value', snapshot => {
          
          vm.imageSelection = snapshot.val();
        });
        }
    },
  },
};
</script>

<style scoped>
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
</style>
