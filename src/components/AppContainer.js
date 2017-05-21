import React, {Component} from 'react';
import request from 'then-request';
import App from './App';

class AppContainer extends Component {
  state = {loading: true, stories: []};
  componentDidMount() {
    this._loadStories();
  }
  _loadStories = () => {
    request('get', '/api/stories')
      .getBody('utf8')
      .then(JSON.parse)
      .done(stories => this.setState({loading: false, stories}));
  };
  _onAddStory = (body) => {
    request('put', '/api/stories', {
      json: {body: body},
    })
      .getBody('utf8')
      .then(JSON.parse)
      .done(stories => this.setState({stories}));
  };
  _onVote = (id) => {
    request('post', '/api/stories/' + id + '/vote')
      .getBody('utf8')
      .then(JSON.parse)
      .done(stories => this.setState({stories}));
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
