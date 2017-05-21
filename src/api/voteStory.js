// @flow

import type {Story} from '../story';
import {voteStory, getStories} from '../db';

export type Input = {|+id: string|};
export type Output = $ReadOnlyArray<Story>;

export default (async function(input: Input): Promise<Output> {
  await voteStory(input.id);
  return await getStories();
});
