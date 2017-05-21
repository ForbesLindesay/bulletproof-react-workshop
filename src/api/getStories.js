// @flow

import type {Story} from '../story';
import {getStories} from '../db';

export type Input = void;
export type Output = $ReadOnlyArray<Story>;

export default function(): Promise<Output> {
  return getStories();
}
