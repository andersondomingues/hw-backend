import axios from 'axios';
import 'dotenv/config';

/**
 * Google API documentation for Directions API available at:
 * https://developers.google.com/maps/documentation/directions/get-directions
 */
interface PairTextValue {
  text: string;
  value: number;
}

interface DistanceMatrixResponseRowElement {
  distance: PairTextValue;
  duration: PairTextValue;
  status: string;
};

interface DistanceMatrixResponseRow {
  elements : DistanceMatrixResponseRowElement[];
};

interface DistanceMatrixResponse {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: DistanceMatrixResponseRow[];
  status: string;
};

/**
 * This class groups the calls to Google APIs
 * - Directions: route calculation and optimization
 * - DistanceMatrix: distance calculation
 */
export class GoogleMapsService {

  // the base address of both apis is the same,
  // so we create a single axios instance for google
  static googleApi = axios.create({
    baseURL: 'https://maps.googleapis.com/',
    headers: { },
  });

  /**
   * Returns the distance (in units) from origin to destination
   * location. 
   * @param origin Origin location name, e.g. "San Marcos, CA"
   * @param destination Destination location name
   * @returns The distance value
   */
  static getDistance = async (origin: String, destination: String) => {
    try {
      // acquire data from distancematrix service 
      const response = await this.googleApi.get("maps/api/distancematrix/json", { params: {
        origins : origin,
        destinations : destination,
        units : 'imperial',   
        key : process.env.API_KEY_GOOGLE   // << google cloud key, must have the api enabled
      }});

      const data : DistanceMatrixResponse = response.data as DistanceMatrixResponse;
      return data.rows[0].elements[0].distance.value;
    } catch (e) {
      console.log(e);
    }

    return 0;
  }

  /**
   * Returns the destination which is more distant from the origin.
   * @param origin The origin location name, e.g., "San Marcos, CA"
   * @param destinations An array of destinations names
   * @returns The destination name which has the largest distance
   */
  static getDestinationNode = async (origin: String, destinations: String[]) => {

    let maxDistance : number = 0;
    let maxDistanceLocation : String = origin;

    for (let i = 0; i < destinations.length; i++) {
      const distance : number = await GoogleMapsService.getDistance(origin, destinations[i]);

      if(distance < maxDistance){
          maxDistance = distance;
          maxDistanceLocation = destinations[i];
      }
    }

    return { maxDistanceLocation, maxDistance}
  }

  /**
   * Route calculation
   * @param origin Departure location name, e.g. "São Paulo, BR"
   * @param destinations An array of waypoint destinations 
   * @returns A directions API response object (see 
   * https://developers.google.com/maps/documentation/directions/get-directions).
   */
  static getDirections = async (origin: String, destinations: String[]) => {

    const { maxDistanceLocation } = await GoogleMapsService.getDestinationNode(origin, destinations);

    const response = await this.googleApi.get("maps/api/directions/json", { params: {
      origin : origin,
      waypoints: "optimize:true|" + destinations.filter(x => x != maxDistanceLocation).join('|'),
      destination:  origin,
      key : process.env.API_KEY_GOOGLE,
      alternatives: false,
      mode: 'driving',
      units: 'imperial',
    }});

    return response.data;
  }

}

