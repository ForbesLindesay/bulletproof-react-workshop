// @flow

import React from 'react';

type Props = {|
  +body: string,
  +onSubmit: (e: SyntheticInputEvent) => mixed,
  +onChangeBody: (e: SyntheticInputEvent) => mixed,
|};

export default function AddStory(props: Props) {
  return (
    <form onSubmit={props.onSubmit}>
      <input
        onChange={props.onChangeBody}
        value={props.body}
        data-test-id="NewStoryBody"
      />
      <button type="submit" data-test-id="AddStoryButton">Add Story</button>
    </form>
  );
}
