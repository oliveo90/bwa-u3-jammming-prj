const appClientId = 'a0a16dbf39804120b9f07e65b5127260';
const appRedirectUri = 'https://oliveospotifyapp.surge.sh';
const url = 'https://api.spotify.com'
const endpoint = '/v1/search?type=track';
let accessToken = '';
let expirationTime = 0;

const Spotify = {
getAccessToken() {


  let expiresIn = /expires_in=(.*)/.exec(window.location.href);
  let userAccessToken = /access_token=(.*?)&/.exec(window.location.href);

  if(userAccessToken && expiresIn) {
     console.log('Your access token: ' + userAccessToken);

    accessToken = userAccessToken[1];
    expirationTime = expiresIn[1];

    window.setTimeout(() => accessToken = '', expirationTime *1000);
    window.history.pushState('Access Token', null, '/');

    return accessToken;

  } else {
    console.log('No access token. Redirecting.');
    window.location.replace(`https://accounts.spotify.com/authorize?client_id=${appClientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${appRedirectUri}`);

    return '';
  }
},

// return track(s) array based on search term
async search(term) {
  if(!accessToken) { this.getAccessToken(); };

  return fetch(`${url}${endpoint}&q=${term}`, {method: 'GET', headers:
    {
    Authorization: 'Bearer ' + accessToken
    }
  }).then(response => {
    return response.json();
  }).then(jsonResponse => {
    if(jsonResponse.tracks) {
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    } else if (!jsonResponse.tracks) {
        return [];
      }
  });
},

// Get userID
async getUserID() {
  if(!accessToken) { this.getAccessToken(); };
  let userID = '';

  return fetch(`${url}/v1/me`, {
    method: 'GET',
    headers: { Authorization:'Bearer ' + accessToken  }
  }).then(response => { return response.json();
  }).then(jsonResponse => {
    userID = jsonResponse.id;
    return userID;
  });
},

// create new playlist
async createSpotifyPlaylist(newPlaylistName) {
  if(!accessToken) { this.getAccessToken(); };
  let userID = await this.getUserID();
  let playlistID = '';

return fetch(`${url}/v1/users/${userID}/playlists`, {
    method: 'POST',
    headers: { Authorization:'Bearer ' + accessToken,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
             },
    body: JSON.stringify({ name: newPlaylistName })
  }).then(response => {
    return response.json();
  }).then(jsonResponse => {
    if(jsonResponse.id) {
      playlistID = jsonResponse.id;
    return playlistID;
} if(!playlistID) {
      console.log('no playlist created');
    };
  }
);

},

// save tracks to new playlist
async savePlaylist(newPlaylistName, trackURIs) {
  let userID = await this.getUserID();
  if(!accessToken) { this.getAccessToken(); };
  let playlistID = await this.createSpotifyPlaylist(newPlaylistName);

  return fetch(`${url}/v1/users/${userID}/playlists/${playlistID}/tracks`, {
    method: 'POST',
    headers: { Authorization:'Bearer ' + accessToken,
              'Content-Type': 'application/json'
             },
    body: JSON.stringify({ uris: trackURIs })
  });


}
}

export default Spotify;
