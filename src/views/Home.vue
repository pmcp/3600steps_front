<template>
  <div class="container">
    <section class="section logo">
      <div>
        <svg
          class="phi"
          viewBox="0 0 306 345"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
        >
          <path
            d="M188.125 301.055C188.125 306.589 188.939 311.227 190.566 314.971C192.357 318.714 194.798 321.725 197.891 324.004C201.146 326.283 205.052 327.91 209.609 328.887C214.329 329.863 219.538 330.352 225.234 330.352C226.536 330.352 227.188 331.003 227.188 332.305V343.047C227.188 343.535 227.106 344.023 226.943 344.512C226.781 344.837 226.211 345 225.234 345H81.4355C80.6217 345 80.0521 344.756 79.7266 344.268C79.5638 343.779 79.4824 343.372 79.4824 343.047V332.305C79.4824 331.979 79.5638 331.572 79.7266 331.084C80.0521 330.596 80.6217 330.352 81.4355 330.352C87.1322 330.352 92.2591 330.026 96.8164 329.375C101.536 328.561 105.524 326.934 108.779 324.492C112.035 322.051 114.557 318.551 116.348 313.994C118.138 309.437 119.033 303.252 119.033 295.439V281.523C101.292 280.059 85.179 276.641 70.6934 271.27C56.2077 265.898 43.7565 258.493 33.3398 249.053C23.0859 239.45 15.1107 227.812 9.41406 214.141C3.71745 200.306 0.869141 184.274 0.869141 166.045C0.869141 148.304 3.71745 132.598 9.41406 118.926C15.2734 105.254 23.4115 93.6165 33.8281 84.0137C44.4076 74.4108 56.8587 66.8424 71.1816 61.3086C85.6673 55.7747 101.618 52.2754 119.033 50.8105V42.2656C119.033 36.7318 118.138 32.2559 116.348 28.8379C114.72 25.2572 112.279 22.4902 109.023 20.5371C105.931 18.584 102.025 17.2819 97.3047 16.6309C92.7474 15.8171 87.6204 15.4102 81.9238 15.4102C80.6217 15.4102 79.9707 14.7591 79.9707 13.457V2.71484C79.9707 1.41276 80.6217 0.761719 81.9238 0.761719H225.723C226.536 0.761719 227.025 1.00586 227.188 1.49414C227.513 1.98242 227.676 2.38932 227.676 2.71484V13.457C227.676 13.7826 227.513 14.1895 227.188 14.6777C227.025 15.166 226.536 15.4102 225.723 15.4102C220.026 15.4102 214.818 15.6543 210.098 16.1426C205.54 16.6309 201.634 17.9329 198.379 20.0488C195.124 22.1647 192.601 25.4199 190.811 29.8145C189.02 34.0462 188.125 40.0684 188.125 47.8809V50.8105C205.866 52.2754 221.979 55.7747 236.465 61.3086C250.951 66.8424 263.32 74.4922 273.574 84.2578C283.828 93.8607 291.722 105.498 297.256 119.17C302.952 132.842 305.801 148.467 305.801 166.045C305.801 183.623 302.952 199.248 297.256 212.92C291.722 226.592 283.828 238.311 273.574 248.076C263.32 257.679 250.951 265.329 236.465 271.025C221.979 276.559 205.866 280.059 188.125 281.523V301.055ZM251.357 166.045C251.357 153.512 249.323 141.875 245.254 131.133C241.348 120.391 236.302 111.113 230.117 103.301C224.095 95.4883 217.34 89.3848 209.854 84.9902C202.367 80.4329 195.124 78.1543 188.125 78.1543V254.18C195.124 254.18 202.367 251.982 209.854 247.588C217.34 243.031 224.095 236.846 230.117 229.033C236.302 221.221 241.348 211.943 245.254 201.201C249.323 190.459 251.357 178.74 251.357 166.045ZM55.3125 166.045C55.3125 178.74 57.2656 190.459 61.1719 201.201C65.2409 211.943 70.3678 221.221 76.5527 229.033C82.9004 236.846 89.8177 243.031 97.3047 247.588C104.792 251.982 112.035 254.18 119.033 254.18V78.1543C112.035 78.1543 104.792 80.4329 97.3047 84.9902C89.8177 89.3848 82.9004 95.4883 76.5527 103.301C70.3678 111.113 65.2409 120.391 61.1719 131.133C57.2656 141.875 55.3125 153.512 55.3125 166.045Z"
            fill="black"
          />
        </svg>

      </div>

      <!-- <h1 class="maintitle">3600 STEPS</h1> -->
    </section>
    <section class="section">

      <!-- <div v-for="(i, index) in imagesAll">
        
        <div @click="deleteFB(i)">Delete</div> {{i.dateAdded}} - <img :src="i.url" style="width:100px;height:auto">
      </div> -->

      <b-field style="float:left">
        <b-select
          placeholder="Choose walk"
          v-model="selectedWalk"
          @input="filterByWalk(selectedWalk['.key'])"
        >
          <option
            :value="'Alles'"
            :key="null"
          >Alles</option>
          <option
            v-for="(item, index) in walks"
            :value="item"
            :key="index"
          >
            {{ item.id}}
          </option>
        </b-select>
      </b-field>

      <!-- <div style="float:left;width:4rem"  @click="getRandom"> -->

      <div style="width:3rem;float:left;top:-.4rem;position:relative; left:1rem;">
        <img
          src="../assets/random.svg"
          alt="random pictures"
          style="width: 100%; height: auto;"
          @click="getRandom"
        >
      </div>

    </section>
    <div>
      <div
        class="grid"
        style=" display: flex;flex-direction:row;flex-wrap:wrap;justify-content: space-between"
      >
        <div
          v-for="(item, index) in imageSelection"
          v-bind:key="index+'_grid'"
          style="width:18%;margin-bottom:2rem;"
          v-bind:style="{'margin-left': Math.floor(Math.random() * 50) + 1  +'px','margin-right': Math.floor(Math.random() * 50) + 1  +'px'  }"
        >
          <div
            class="filtered"
            v-bind:class="classes[Math.floor(Math.random() * 2)]"
            style="float:left"
            @click="imageModal(item.image.uuid)"
          >
            <img
              v-if="item.image"
              class="grid-picture"
              :src="item.image.uuid | getResized"
            >
            <img
              v-else
              class="grid-picture"
              :src="item.url "
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "Home",
  data() {
    return {
      imageSelection: {},
      selectedWalk: null,
      theWalk: null,
      classes: ["red", "blue"],
      imagesAll: [],
      numberOfPicturesInSelection: 12
    };
  },
  filters: {
    getResized: function(id) {
      return "https://ucarecdn.com/" + id + "/-/resize/300x/";
    }
  },
  firebase: function() {
    return {
      walks: {
        source: db.ref("data/walks"),
        readyCallback: function() {
          this.getRandom();
        }
      }
    };
  },
  metaInfo: {
    title: "Home"
  },

  methods: {
    imageModal(url) {
      const randomClass = this.classes[Math.floor(Math.random() * 2)];
      console.log(randomClass);
      this.$modal.open(
        '<div class="filtered ' +
          randomClass +
          '" ><img src="https://ucarecdn.com/' +
          url +
          '/-/resize/900x/"></div>'
      );
    },
    getRandom: function() {
      let vm = this;
      Array.prototype.shuffle = function() {
        for (var i = 0; i < this.length; i++) {
          var a = this[i];
          var b = Math.floor(Math.random() * this.length);
          this[i] = this[b];
          this[b] = a;
        }
      };
      function shuffleProperties(obj) {
        var new_obj = {};
        var keys = getKeys(obj);
        keys.shuffle();
        keys = keys.slice(0, vm.numberOfPicturesInSelection);
        for (var key in keys) {
          if (key == "shuffle") continue;
          new_obj[keys[key]] = obj[keys[key]];
        }
        return new_obj;
      }
      function getKeys(obj) {
        var arr = new Array();
        // also a small step to check if the picture is hidden, otherwise it shouldnt be in the array
        for (var key in obj)
          if (obj[key].hide !== true) {
            arr.push(key);
          }
        return arr;
      }
      let walk = vm.theWalk;

      if (walk == null) {
        db.ref("data/images").once("value", snapshot => {
          let images = snapshot.val();
          vm.imageSelection = shuffleProperties(images);
        });
      } else {
        db.ref("data/images")
          .orderByChild("walk")
          .equalTo(walk)
          .once("value", snapshot => {
            let images = snapshot.val();
            vm.imageSelection = shuffleProperties(images);
          });
      }
    },

    filterByWalk: function(walk) {
      let vm = this;
      vm.theWalk = walk;
      if (walk == null) {
        return;
      } else {
        db.ref("data/images")
          .orderByChild("walk")
          .equalTo(walk)
          .once("value", snapshot => {
            vm.imageSelection = snapshot.val();
            vm.getRandom();
          });
      }
    }
  }
};
</script>

<style >
.maintitle {
  font-size: 6vw;
  text-align: center;
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
  background-color: RGBA(255, 255, 255, 0.8);
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}
.phi {
  height: 5rem;
  width: auto;
}

.phi path {
  fill: black;
}
</style>
