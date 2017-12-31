
let accessToken;
const clientID = '0f133b21384a4abd909e2138043860ad';
const redirectUri = 'http://js2-jammming.surge.sh/';
const accessTokenPatt = /access_token=([^&]*)/;
const expirationTimePatt = /expires_in=([^&]*)/;

const Spotify = {
  getAccessToken: function() {
    if (accessToken) {
      return accessToken;
    } else if (!(accessTokenPatt.test(window.location.href) && expirationTimePatt.test(window.location.href))) {
      window.location =
       `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }

    let expirationTime;
    const currentUrl = window.location.href;
    if (currentUrl) {
      accessToken = currentUrl.match(accessTokenPatt);
      expirationTime = currentUrl.match(expirationTimePatt);
    }

    if (accessToken && expirationTime) {
      if (accessToken.length !== 0 && expirationTime.length !== 0) {
        accessToken = accessToken[1];
        expirationTime = expirationTime[1];
        window.setTimeout(() => accessToken = '', expirationTime * 1000);
        window.history.pushState('Access Token', null, '/');
      }
    }
  },

  search: async function(searchTerm) {
    if (searchTerm) {
      try {
        let response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
    			let jsonResponse = await response.json();

          return jsonResponse.tracks.items.map(track => {
            return {name: track.name,
             artist: track.artists[0].name,
             album: track.album.name,
             id: track.id,
             uri: track.uri}
          });
    		}
    		throw new Error('Request failed!');
      } catch (error) {
        console.log(error);
      }
    }
  },

  savePlaylist: async function(playlistName, trackURIS) {
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `application/json`
    };
    let userID;

    if (!playlistName || !trackURIS || trackURIS.length === 0) {
      return;
    }

  	try {
  		let response = await fetch(`https://api.spotify.com/v1/me`,
        {headers: headers}
      )
  		if (response.ok) {
  			let jsonResponse = await response.json();
        userID = jsonResponse.id

        try {
      		let response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({name: playlistName})
          })
      		if (response.ok) {
      			let jsonResponse = await response.json();
            let playlistID = jsonResponse.id;

            try {
              let response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({"uris": trackURIS})
              })
              if (response.ok) {
                let jsonResponse = await response.json();
                return jsonResponse;
              }
              throw new Error(`Request failed!`);
            } catch (error) {
              console.log(error);
            }

      		}
      		throw new Error(`Request failed!`);
      	} catch (error) {
      		console.log(error);
      	}

  		}
  		throw new Error(`Request failed!`);
  	} catch (error) {
  		console.log(error);
  	}

  }

};

export default Spotify;
