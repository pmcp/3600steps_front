<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Pas aan</p>
    </header>
    <section class="modal-card-body">
      <div class="columns">
        <div class="column ">
          <vue-form :state="formstate" @submit.prevent="onSubmit">
            <validate tag="label">
              <div class="field">
                <label class="label">Nederlands</label>
                <div class="control">
                  <textarea v-model="text.nl" type="text" name="editable" class="input" @input="updateItem(text)" ></textarea>
                </div>
              </div>
            </validate>
            <validate tag="label">
              <div class="field">
                <label class="label">Frans</label>
                <div class="control">
                  <textarea v-model="text.fr" type="text" name="editable" class="input" @input="updateItem(text)" ></textarea>
                </div>
              </div>
            </validate>
            <validate tag="label">
              <div class="field">
                <label class="label">Engels</label>
                <div class="control">
                  <textarea v-model="text.en" type="text" name="editable" class="input" @input="updateItem(text)" ></textarea>
                </div>
              </div>
            </validate>
          </vue-form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { db } from '../firebase';

export default {
  name: 'Edit Content',
  data() {
    return {
      editableText: {},
      formstate: {},
    };
  },
  props: ['database', 'text'],
  firebase: function() {
    return {
      admin: db.ref('admin'),
    };
  },
  methods: {
    updateItem: function(item) {
      let key = item['.key'];
      let newItem = JSON.parse(JSON.stringify(item));
      delete newItem['.key'];
      this.$firebaseRefs.admin.child(item.context + '/' + key).update(newItem);
    },
  },
};
</script>

<style scoped>
</style>
