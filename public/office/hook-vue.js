new Vue({
      el: '#vue-app',
      components: {
        'vue-app': httpVueLoader('app.vue'),
        'vue-app-r': httpVueLoader('app-r.vue'),
      },
    });

