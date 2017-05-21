// @flow
// Generated Code!

import type {
  Input as addStoryInput,
  Output as addStoryOutput,
} from './api/addStory.js';
import addStory from './api/addStory.js';
import type {
  Input as getStoriesInput,
  Output as getStoriesOutput,
} from './api/getStories.js';
import getStories from './api/getStories.js';
import type {
  Input as voteStoryInput,
  Output as voteStoryOutput,
} from './api/voteStory.js';
import voteStory from './api/voteStory.js';

const modules = {
  addStory: (addStory: (input: addStoryInput) => Promise<addStoryOutput>),
  getStories: (getStories: (
    input: getStoriesInput,
  ) => Promise<getStoriesOutput>),
  voteStory: (voteStory: (input: voteStoryInput) => Promise<voteStoryOutput>),
};

export default modules;
