import React, { Component } from 'react';
import './TrackList.css';
import Track from '../Track/Track'

class TrackList extends Component {
  render() {
    let trackList = [];
    if (this.props.tracks) {
      trackList = this.props.tracks.map(
        track => <Track track={track}
                  key={track.id}
                  onAdd={this.props.onAdd}
                  onRemove={this.props.onRemove}
                  trackActionRemove={this.props.trackActionRemove}/>)
    }
    return (
      <div className="TrackList">{trackList}</div>
    )

  }
}

export default TrackList;
