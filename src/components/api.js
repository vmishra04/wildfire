import Axios from 'axios';

const placesUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const token = 'pk.eyJ1IjoianJteSIsImEiOiJjazA5MXQwdngwNDZhM2lxOHFheTlieHM3In0.1Jh_NjL_Nu3YYeMUOZvmrA';

const api = {
  search: (term) => {
    return Axios({
      url: `${[placesUrl]}/${term}.json?access_token=${token}&cachebuster=1567876695169&autocomplete=true&types=address%2Cneighborhood%2Cpostcode`,
      method: 'get',
    })
    .then(function(response) {
      return response;
    });
  },
};

export default api;