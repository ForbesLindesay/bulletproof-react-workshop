// @flow

import React, {Component} from 'react';

type Props = {|
  +id: string,
  +votes: number,
  +body: string,
  +onVote: (id: string) => mixed,
|};

function Story(props: Props) {
  return (
    <article data-test-id="story">
      <span className="vote-count" data-test-id="VoteCount">
        {props.votes}
      </span>
      <div className="story-body" data-test-id="StoryBody">{props.body}</div>
      <button
        type="button"
        onClick={() => props.onVote(props.id)}
        data-test-id="AddVote"
      >
        Vote
      </button>
    </article>
  );
}

export default Story;
