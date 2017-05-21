// @flow

import type {Story} from '../story';
import React, {Component} from 'react';
import App from './App';
import addStory from '../api-client/addStory';
import getStories from '../api-client/getStories';
import voteStory from '../api-client/voteStory';

type State = {
  loading: boolean,
  stories: $ReadOnlyArray<Story>,
};
class AppContainer extends Component {
  props: {||};
  state: State = {loading: true, stories: []};
  componentDidMount() {
    this._loadStories();
  }
  _loadStories = () => {
    getStories().then(stories => this.setState({loading: false, stories}));
  };
  _onAddStory = (body: string) => {
    addStory({body}).then(stories => this.setState({stories}));
  };
  _onVote = (id: string) => {
    voteStory({id}).then(stories => this.setState({stories}));
  };
  render() {
    return (
      <App
        loading={this.state.loading}
        stories={this.state.stories}
        onAddStory={this._onAddStory}
        onVote={this._onVote}
      />
    );
  }
}

export default AppContainer;
