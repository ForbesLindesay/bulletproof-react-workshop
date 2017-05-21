// @flow

import type {Story} from '../story';
import {addStory, getStories} from '../db';

export type Input = {|+body: string|};
export type Output = $ReadOnlyArray<Story>;

export default (async function(input: Input): Promise<Output> {
  await addStory(input.body);
  return await getStories();
});
