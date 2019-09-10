import Axios from 'axios';

const placesUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const token = 'pk.eyJ1IjoianJteSIsImEiOiJjazA5MXQwdngwNDZhM2lxOHFheTlieHM3In0.1Jh_NjL_Nu3YYeMUOZvmrA';
const create = 'https://orion.jrmyphlmn.com/ether'

const api = {
  search: (term) => {
    return Axios({
      url: `${placesUrl}/${term}.json?access_token=${token}&cachebuster=1567876695169&autocomplete=true&types=address%2Cneighborhood%2Cpostcode`,
      method: 'get',
    })
    .then(function(response) {
      return response;
    });
  },
  ai: (lat, long) => {
    return Axios({
      url: `http://localhost:5000/fire/${lat}/${long}`,
      method: 'get',
    })
    .then(function(response) {
      return response;
    });
  },
  sign: (data) => {
    return Axios({
      url: create,
      method: "post",
      data: data,
    })
    .then(res => res.data)
    .catch(err => console.log(err))
  },
  signDB: (data) => {
    return Axios({
      url: 'http://localhost:3000/sign',
      method: "post",
      data: data,
    })
    .then(res => res.data)
    .catch(err => console.log(err))
  },
};

export default api;