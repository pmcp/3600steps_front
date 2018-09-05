<template>
  <div class="section">
    <div class="columns">
      <div class="column is-offset-one-fifth is-three-fifths">
        <vue-form :state="formstate" @submit.prevent="onSubmit">
              <!-- <label>Taal</label> -->
              <!-- <select v-model="user.language" class="u-full-width">
                              <option value="nl">NL</option>
                              <option value="en">EN</option>
                          </select> -->

          <validate tag="label">
            <div class="field">
              <label class="label" @click.alt="edit(copy[0])">{{copy[0][user.language]}}</label>
              <div class="control">
                <input v-model="user.first" type="text" required name="first" class="input" />
                <!-- <field-messages name="first">
                  <div>Gelukt!</div>
                  <div slot="required" class="help is-danger">Je moet je voornaam opgeven.</div>
                </field-messages> -->
              </div>
            </div>
          </validate>
          <br/>
          <validate tag="label">
            <div class="field">
              <label class="label" @click.alt="edit(copy[1])">{{copy[1][user.language]}}</label>
              <div class="control">
                <input v-model="user.last" type="text" required name="last" class="input" />
                <!-- <field-messages name="last">
                  <div>Gelukt!</div>
                  <div slot="required">Je moet je achternaam opgeven.</div>
                </field-messages> -->
              </div>
            </div>
          </validate>
          <br/>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link is-fullwidth" @click.alt="edit(copy[2])">{{copy[2][user.language]}}</button>
            </div>
          </div>

        </vue-form>
      </div>
    </div>

  </div>

</template>

<script>

export default {
  name: 'Form',
  props: ['user', 'copy'],
  data() {
    return {
      formstate: {},
    };
  },
  methods: {
    onSubmit: function() {
      if (this.formstate.$invalid) {
        return;
      }
      this.$emit('saveUser', this.user);
    },
    edit: function(value) {
      this.$emit('edit', value);
    },
  },
};
</script>

<style scoped>
</style>
