<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit Mode</p>
    </header>
    <section class="modal-card-body">
        <a class="button" @click="localStorageBehavior">Delete Local Storage</a>
        <!-- <div class="field">
            <b-switch>Save User in Local Storage</b-switch>
        </div>
        <div class="field">
            <b-switch v-model="keepLocalStorage" @input="localStorageBehavior">
                {{ keepLocalStorage }}
            </b-switch>
        </div> -->

    </section>
  </div>
</template>

<script>
export default {
  name: 'Edit Menu',
  data() {
    return {
      // keepLocalStorage: true,
    };
  },
  props: [],
  methods: {
    localStorageBehavior: function() {
      this.$emit('localStorageBehavior', this.keepLocalStorage);
    },
  },
};
</script>

<style scoped>
</style>
