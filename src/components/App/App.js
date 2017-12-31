import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: [] };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    Spotify.getAccessToken();
  }

  addTrack(track) {
    const alreadyInPlaylist = this.state.playlistTracks.some(playListTrack => {
      return playListTrack.id === track.id
    });

    if (!alreadyInPlaylist) {
      this.setState(prevState => {
        prevState.playlistTracks.push(track);
        return {
          playlistTracks: prevState.playlistTracks
        };
      });
    }
  }

  removeTrack(track) {
    this.setState(prevState => {
      const newPlaylist = prevState.playlistTracks.filter(playListTrack => {
        return playListTrack.id !== track.id
      });
      return {
        playlistTracks: newPlaylist
      };
    });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(playlistTracks => playlistTracks.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className='App-playlist'>
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
              <PlayList playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}/>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
