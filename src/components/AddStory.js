import React from 'react';

export default function AddStory(props) {
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
