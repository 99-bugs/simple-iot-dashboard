let app = null;

const topic = 'workshop/+'
const mqttServer = 'mqtt://192.168.1.158:9001'
const api_url = 'sensors.php'

axios.get(api_url)
  .then((response) => {
    app.$data.sensors = response.data;
  }) 
 
// Wait for the document to be fully loaded so that all 
// context is available before running any code

document.addEventListener("DOMContentLoaded",function(){

  Vue.use(VueMqtt.default, mqttServer)

  // Create a new Vue application. 
  app = new Vue({
    el: '#app',         // the element on which the Vue app must be build on
    data: {             // the application contains some data
      sensors: [] 
    },
    mounted () {
      this.$mqtt.subscribe(topic)       // subscribe to the information topic on MQTT
    },
    mqtt: {
      [topic]: function (data, topic){        // when a message arrives on our topic
        let message = parseData(data)
        let sensor = findSensor(topic)
        if(sensor){
          updateSensorValue(sensor, message)
        }
      }
    }
  });
});

function updateSensorValue(sensor, value) {
  sensor.value = value.toString()
}

function findSensor(topic){
  return app.$data.sensors.find(sensor => {
    return sensor.topic == topic
  })
}

function parseData(data){
  let json = (new TextDecoder("utf-8").decode(data))    // we need to convert (decode) the byte information to a text string
  return JSON.parse(json)                               // parse the JSON format to an object
}