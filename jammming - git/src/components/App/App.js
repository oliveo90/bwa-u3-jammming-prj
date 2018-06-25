import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    searchResults: [],
    playlistName: 'New Playlist',
    playlistTracks: []
  };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
};

  addTrack(track) {
    let changedPlaylistTracks = this.state.playlistTracks.concat(track);
    this.setState({playlistTracks: changedPlaylistTracks});
  };

  removeTrack(track) {
    let changedPlaylistTracks = this.state.playlistTracks;
    this.setState({ playlistTracks: changedPlaylistTracks.filter(otherTrack => otherTrack !== track) });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    let newPlaylistName = this.state.playlistName;

    Spotify.savePlaylist(newPlaylistName, trackURIs).then(
    this.setState({playlistName: 'New Playlist', playlistTracks: []}));
  }

  search(term) {
    Spotify.search(term).then(resultArray => {this.setState({searchResults: resultArray})});
  }

  render() {
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
  {/* SearchBar component */}
    <SearchBar onSearch={this.search} />

    <div className="App-playlist">
    {/* SearchResults component */}
      <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />

    {/* Playlist component */}
      <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} onSave={this.savePlaylist} />
    </div>
  </div>
</div>
    );
  }
}

export default App;
