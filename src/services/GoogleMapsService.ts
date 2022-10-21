import axios from 'axios';
import 'dotenv/config';

// var config = {
//   method: 'get',
//   url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington%2C%20DC&destinations=New%20York%20City%2C%20NY&units=imperial&key=YOUR_API_KEY',
//   headers: { }
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

export class GoogleMapsService {
 
  static googleApi = axios.create({
    baseURL: 'https://maps.googleapis.com/',
    headers: { },
  });

  static getDistance = (origin: String, destination: String) => {

    const response = this.googleApi.get("maps/api/distancematrix/json", { params: { 
      origins : origin,
      destinations : destination,
      units : 'imperial',
      key : process.env.GOOGLE_API_KEY
    }}); 

    return response;
  }

  static getDirections = async (origin: String, destinations: String[]) => {

    const response = await this.googleApi.get("maps/api/directions/json", { params: { 
      origin : origin,
      intermediates: destinations[0], 
      destination: destinations[1],
      key : process.env.API_KEY_GOOGLE,
      alternatives: false,
      mode: 'driving',
      units: 'imperial',
    }}); 
    return response.data;
  }
  
}

