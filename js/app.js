document.addEventListener('DOMContentLoaded', () => {
  axios.get('sensors.json').then((response) => {
    const config = response.data;
    Vue.use(VueMqtt.default, `mqtt://${config.mqtt.broker}:${config.mqtt.port}`)
    let app = new Vue({
      el: '#app',
      data: {
        sensors: config.sensors,
      },
      mounted() {
        this.sensors.forEach((sensor) => {
          this.$mqtt.subscribe(sensor.topic);
        });
      },
      mqtt: {
        '#': function mqttResponse(data, topic) {
          const value = new TextDecoder('utf-8').decode(data);
          const sensor = this.sensors.find(s => s.topic === topic);
          if (sensor) {
            sensor.value = value.toString();
          }
        },
      },
    });
  });
});
