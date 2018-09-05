<template>
  <div >

    <carousel   :perPage="1" ref="carousel">
      <slide  v-if="user.started == null" class="instructions-slide" style="height:75vh;" >
        <div  style="height:100%;">
          <div class="columns">
            <div class="column is-offset-one-fifth is-three-fifths">
              <div class="section" >
                <p class="instruction_text" v-html="copy[2][user.language]" @click.alt="edit(copy[2])">

                </p>
              </div>
              <div class="section">
                <div class="columns" >
                  <div class="column">
                    <a class="button level-item" @click="setLanguage('nl')">Nederlands</a>
                  </div>
                  <div class="column">
                    <a class="button level-item" @click="setLanguage('fr')">Français</a>
                  </div>
                  <div class="column">
                    <a class="button level-item" @click="setLanguage('en')" >English</a>
                  </div>
                </div>
              </div>
              <!-- <div class="section">
                  <a class="button is-fullwidth" @click="nextSlide()" >Lees de uitleg.</a>
              </div> -->
            </div>
          </div>
        </div>
      </slide>

      <slide class="section instructions-slide"  style="background-color:#DC4A4E;color:#fff;text-align:center;padding-left:4rem;padding-right:2rem;" v-if="user.started == null">
        <div  v-html="copy[9][user.language]" @click.alt="edit(copy[9])"></div>
      </slide>

      <slide class="section instructions-slide" style="height:75vh;padding-left:2rem;padding-right:2rem;" v-for="(slide, index) in slides" v-bind:key="index+'_slide'"  >
        <div v-html="slide[user.language]"  @click.alt="edit(slide)"></div>
      </slide>


      <slide v-if="user.started == null" class="section instructions-slide">
        <Form :user="user" :copy="copy" v-on:saveUser="saveUser" v-on:edit="edit"></Form>
        <div class="section" style="padding-left:5rem;padding-right:5rem;" v-html="copy[10][user.language]" @click.alt="edit(copy[10])"></div>

      </slide>

    </carousel>



  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';
import Form from '../components/Walk.Instructions.Form.vue';

export default {
  name: 'Instructions',
  data() {
    return {
      isComponentModalActive: false,
      colorSlideBack: '#fff',
      colorSlideText: '#4a4a4a',
    };
  },
  props: ['user', 'copy', 'slides'],
  components: {
    Carousel,
    Slide,
    Form,
  },
  methods: {
    saveUser: function(user) {
      this.$emit('saveUser', user);
    },

    nextSlide: function() {
      this.$refs.carousel.goToPage(this.$refs.carousel.getNextPage());
    },
    setLanguage: function(language) {
      this.user.language = language;
      this.nextSlide();
    },
    edit: function(value) {
      this.$emit('edit', value);
    },
  },
};
</script>


<style scoped>
.instructions-slide {
  height: 75vh;
}

@media screen and (device-aspect-ratio: 40/71) {
  .instructions-slide {
    height: 400px;
  }
}
</style>
