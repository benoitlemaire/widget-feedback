<template>
  <div>
    <section>
      <img src="https://picsum.photos/id/99/1920/1080">
    </section>
    <section>
      <img src="https://picsum.photos/id/26/1920/1080">
    </section>
    <section>
      <img src="https://picsum.photos/id/33/1920/1080">
    </section>
    <ScreenWidget />
  </div>
</template>

<script>
import ScreenWidget from '../components/ScreenWidget.vue';

export default {
  components: {
    ScreenWidget,
  },
};
</script>
