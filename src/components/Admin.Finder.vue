<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-narrow">
        {{ walks }}
        <div
          v-for="(item, index) in walks"
          v-bind:key="index+'_walks'"
          v-on:click="openWalk(item['.key'])"
          class="pointer hover"
        >{{item.id}}</div>
      </div>
      <div class="column auto">
        <div class="columns">
          <div class="column is-narrow">
            <div
              v-for="(item, index) in usersSubset"
              v-bind:key="index+'_users'"
              v-on:click="getPictures(index)"
              class="pointer hover"
            >{{item.user.first}} {{item.user.last}}</div>
          </div>
          <div class="column is-half">
            <div class="columns is-multiline">
              <div
                class="column is-2"
                v-for="(item, index) in picturesSubset"
                v-bind:key="index+'_images'"
                v-on:click="setMeta(item.meta, item.url)"
              >
                {{item.dateAdded | moment}}
                <img :src="item.url" alt class="pointer picture">
              </div>
            </div>
          </div>
          <div class="column">
            <div v-if="meta != null">
              <a :href="url">{{url}}</a>
              <br>
              <div v-for="(item, index) in meta.vision" v-bind:key="index+'_vision'">
                <p>{{item}}</p>
              </div>
              <div v-for="(item, index) in meta.meta" v-bind:key="index+'_meta'">
                <p>{{item}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";
import moment from "moment";

export default {
  name: "Finder",
  data() {
    return {
      picturesSubset: {},
      usersSubset: {},
      meta: null,
      walk: ""
    };
  },
  props: ["database"],
  filters: {
    moment: function(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    }
  },
  metaInfo: {
    title: "Finder"
  },
  firebase: function() {
    return {
      admin: db.ref("/admin"),
      walks: db.ref(this.database + "/walks"),
      pictures: db.ref(this.database + "/images"),
      users: db.ref(this.database + "/users")
    };
  },
  methods: {
    openWalk: function(walk) {
      let vm = this;
      // Clean everything
      vm.usersSubset = {};
      vm.picturesSubset = {};
      vm.meta = null;
      // Get Users
      vm.$firebaseRefs.users
        .orderByChild("walk")
        .equalTo(walk)
        .limitToLast(36)
        .once("value", snapshot => {
          vm.usersSubset = snapshot.val();
          vm.meta = null;
        });
      // Set Meta of Walk
      vm.walk = walk;
    },
    getAllPictures: function(walk) {
      let vm = this;
      // Get all the images
      vm.$firebaseRefs.pictures
        .orderByChild("walk")
        .equalTo(walk)
        .limitToLast(36)
        .once("value", snapshot => {
          vm.picturesSubset = snapshot.val();
        });
    },
    getPictures: function(user) {
      let vm = this;
      vm.$firebaseRefs.pictures
        .orderByChild("user")
        .equalTo(user)
        .limitToLast(36)
        .once("value", snapshot => {
          vm.picturesSubset = snapshot.val();
          vm.meta = null;
        });
    },
    setMeta: function(meta, url) {
      let vm = this;
      vm.url = url;
      if (meta === null) {
        return;
      } else {
        vm.meta = meta;
      }
    }
  }
};
</script>

<style scoped>
.picture {
  width: 100%;
  height: auto;
}

.pointer {
  cursor: pointer;
}

.hover:hover {
  color: #dc4a4e;
  transition: color 0.4s;
}
</style>
