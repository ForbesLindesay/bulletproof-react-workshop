// @flow

import React, {Component} from 'react';
import AddStory from './AddStory';

type Props = {|
  +onAddStory: (body: string) => mixed,
|};

export default class AddStoryContainer extends Component {
  props: Props;
  state = {body: ''};

  _onChangeBody = (e: SyntheticInputEvent) => {
    this.setState({body: e.target.value});
  };
  _onSubmit = (e: SyntheticEvent) => {
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
