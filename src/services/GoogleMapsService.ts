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

    this.googleApi.get("maps/api/distancematrix/json", { params: { 
      origins : origin,
      destinations : destination,
      units : 'imperial',
      key : process.env.GOOGLE_API_KEY
    }}); 
  }
}

