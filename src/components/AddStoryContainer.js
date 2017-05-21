import React, {Component} from 'react';
import AddStory from './AddStory';

export default class AddStoryContainer extends Component {
  state = {body: ''};

  _onChangeBody = (e) => {
    this.setState({body: e.target.value});
  };
  _onSubmit = (e) => {
    e.preventDefault();
    if (!this.state.body) return;
    this.props.onAddStory(this.state.body);
    this.setState({body: ''});
  };
  render() {
    return (
      <AddStory
        body={this.state.body}
        onChangeBody={this._onChangeBody}
        onSubmit={this._onSubmit}
      />
    );
  }
}
