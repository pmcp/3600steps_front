<template>
    <div style="padding:20px;" >

        <h2>Current Database: {{database}}</h2>
        <h2>Slides</h2>
        <ul>
            <li class="copy_item" v-for="(item, index) in slides" v-bind:key="index">
                Nederlands:
                <textarea class="u-full-width" v-model="item.nl" placeholder="" @input="updateItem(item, 'slides')"></textarea>
                Engels:
                <textarea class="u-full-width" v-model="item.en" placeholder="" @input="updateItem(item, 'slides')"></textarea>
                Frans:
                <textarea class="u-full-width" v-model="item.fr" placeholder="" @input="updateItem(item, 'slides')"></textarea>
            </li>
        </ul>

        <h2>Voeg Slide toe</h2>
        <div>
            <label>Nederlands:</label>
            <textarea class="u-full-width" v-model="newSlide.nl" placeholder=""></textarea>
        </div>
        <div>
            <label>Engels:</label>
            <textarea class="u-full-width" v-model="newSlide.en" placeholder=""></textarea>
        </div>
            <div>
            <label>Frans:</label>
            <textarea class="u-full-width" v-model="newSlide.fr" placeholder=""></textarea>
        </div>
        <button @click="addSlide(newSlide)" class="u-full-width">Voeg Slide toe</button>







        <h2>Copy</h2>
        <ul class="admin_list">
            <li class="copy_item" v-for="(item, index) in copy" v-bind:key="index">
                <label>{{item.id}}</label>
                <!-- Nederlands<input v-model="item.nl" @input="updateCopy(item, $event.target.value)" class="u-full-width" type="text"> -->
                <!-- Engels<input v-model="item.en" @input="updateCopy(item, $event.target.value)" class="u-full-width" type="text"> -->
                Nederlands:
                <textarea class="u-full-width" v-model="item.nl" placeholder="" @input="updateItem(item, 'copy')"></textarea>
                Engels:
                <textarea class="u-full-width" v-model="item.en" placeholder="" @input="updateItem(item, 'copy')"></textarea>
                Frans:
                <textarea class="u-full-width" v-model="item.fr" placeholder="" @input="updateItem(item, 'copy')"></textarea>

            </li>
        </ul>



        <br/><br/><br/>

        <h2>Voeg Copy toe</h2>
        <div>
            <label>Beschrijving:</label>
            <input v-model="newCopy.id" placeholder="" class="u-full-width" type="text">
        </div>
        <div>
            <label>Nederlands:</label>
            <textarea class="u-full-width" v-model="newCopy.nl" placeholder=""></textarea>
        </div>
        <div>
            <label>Engels:</label>
            <textarea class="u-full-width" v-model="newCopy.en" placeholder=""></textarea>
        </div>
            <div>
            <label>Frans:</label>
            <textarea class="u-full-width" v-model="newCopy.fr" placeholder=""></textarea>
        </div>
        <button @click="addCopy(newCopy)" class="u-full-width">Voeg Copy toe</button>


        <h2>Kleuren</h2>

        <label>Basis kleur:</label>
        <input v-model="colours.main" @input="updateItem(colours, 'colours')" class="u-full-width" type="text">
        <label>Tweede kleur:</label>
        <input v-model="colours.secondary" @input="updateItem(colours, 'colours')" class="u-full-width" type="text">


        <br/><br/><br/>

        <h2>Voeg wandeling toe</h2>
        <div>
            <label>Naam:</label>
            <input v-model="newWalk.id" placeholder="" class="u-full-width" type="text">
        </div>
        <div>
            <label>Area:</label>
            <input v-model="newWalk.area" placeholder="" class="u-full-width" type="text">
        </div>
        <button @click="addWalk(newWalk)" class="u-full-width">Voeg wandeling toe</button>

        <br/><br/><br/>

        <h2>Wandelingen</h2>
        <ul class="admin_list">
            <li class="walk_item" v-for="(item, index) in walks" v-bind:key="index + '-walks'">

                <label>Naam: </label>
                <input v-model="item.id" @input="updateItem(item, 'walks')" class="u-full-width" type="text">

                <label>Area: </label>
                <input v-model="item.area" @input="updateItem(item, 'walks')" class="u-full-width" type="text">

            </li>
        </ul>

    </div>
</template>

<script>
import { db } from '../firebase';

export default {
  name: 'Admin',
  data() {
    return {
      newWalk: {},
      newCopy: {},
      newSlide: {},
    };
  },
  props: ['database'],
  firebase: function() {
    return {
      walks: db.ref(this.database + '/walks'),
      pictures: db.ref(this.database + '/images'),
      users: db.ref(this.database + '/users'),
      copy: db.ref('admin/copy'),
      colours: db.ref('admin/colours'),
      slides: db.ref('admin/slides'),
    };
  },
    metaInfo: {
      title: 'Settings',
    },
  methods: {
    updateItem: function(item, context) {
      let key = item['.key'];
      let newItem = JSON.parse(JSON.stringify(item));
      delete newItem['.key'];
      this.$firebaseRefs[context].child(key).update(newItem);
    },

    addWalk(item) {
      let vm = this;
      vm.$firebaseRefs.walks.push({
        area: item.area || '',
        id: item.id || '',
      });
      this.newWalk = {};
    },

    addCopy(item) {
      let vm = this;
      vm.$firebaseRefs.copy.push({
        nl: item.nl || '',
        en: item.en || '',
        fr: item.fr || '',
        id: item.id || '',
        context: 'copy',
      });
      this.newCopy = {};
    },

    addSlide(item) {
      let vm = this;
      vm.$firebaseRefs.slides.push({
        nl: item.nl || '',
        en: item.en || '',
        fr: item.fr || '',
        context: 'slides',
      });
      this.newCopy = {};
    },
  },
};
</script>

<style scoped>
.admin_list {
  list-style-type: none;
}

li:nth-child(odd) {
  position: relative;
}

.walk_item:nth-child(odd)::after {
  position: absolute;
  height: 100%;
  top: -6px;
  left: -20%;
  z-index: -1;
  content: '';
  background-color: #eee;
  width: 200%;
}

.copy_item:nth-child(odd)::after {
  position: absolute;
  height: 100%;
  top: -6px;
  left: -20%;
  z-index: -1;
  content: '';
  background-color: #eee;
  width: 200%;
}
</style>
