
// Wait for the document to be fully loaded so that all 
// context is available before running any code

document.addEventListener("DOMContentLoaded",function(){

  // Create a new Vue application. 
  const app = new Vue({
    el: '#app',         // the element on which the Vue app must be build on
    data: {             // the application contains some data
      weather: {},      // some weather information, but we do not have any values yet
      lastUpdate: 0
    }
  });

  Vue.use(vueMoment);

  // MQTT client to get weather information and real-time updates

  // Every client must have an unique id, lets create a random string value
  const clientId = Math.random().toString(36).substring(20);

  // create a client object that will connect to the labict MQTT broker
  const client = new Paho.MQTT.Client('mqtt.labict.be', 1884, '', clientId);

  // when an update is received, the following function will called with the information
  client.onMessageArrived = function(message){
    let data = JSON.parse(message.payloadString)    // parse the JSON format to an object
    console.log(data);
    app.$data.weather = data;                       // pass the data to the Vue app
  }

  // to connect to the MQTT broker, some extra options must be specified
  const options = {
    // when the connection is successful, we need to subscribe to the weather channel
    onSuccess: function() {
      console.log("connected !");
      client.subscribe("webtechnology/hello-world/weather");
    }
  }

  // everything is set, we are now ready to connect to the MQTT broker
  client.connect(options);
  console.log("connecting");
  
});