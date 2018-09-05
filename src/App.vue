<template>
  <div id="app">
    <router-view :database="database" v-on:localStorageBehavior="deleteLocalStorage" ></router-view>
  </div>
</template>

<script>
import EditMenu from './components/Edit.Menu.vue';

export default {
  name: 'app',
  data() {
    return {
      database: 'v2',
    };
  },
  components: {
    EditMenu,
  },
  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: '3600 Steps',
      // all titles will be injected into this template
      titleTemplate: '%s | 3600 Steps'
    },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
    deleteLocalStorage() {
      this.$storage.remove('userKey');
    },
    openMenu() {
      this.$modal.open({
        parent: this,
        component: EditMenu,
        hasModalCard: true,
        props: {},
      });
    },
  },
};
</script>

<style lang="scss">
// Import Bulma
@import 'assets/bulma_variables';
</style>
