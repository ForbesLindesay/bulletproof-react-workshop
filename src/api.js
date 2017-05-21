import fs from 'fs';
import uid from 'uid';

function readDatabase() {
  try {
    return JSON.parse(fs.readFileSync(__dirname + '/../data.json', 'utf8'));
  } catch (ex) {
    if (ex.code === 'ENOENT') {
      return [];
    }
    throw ex;
  }
}

let state = readDatabase();

async function writeDatabase(newState) {
  state = newState.sort((a, b) => {
    return b.votes - a.votes;
  });
  return new Promise((resolve, reject) => {
    fs.writeFile(
      __dirname + '/../data.json',
      JSON.stringify(state, null, '  '),
      (err, res) => {
        if (err) reject(err);
        else resolve(res);
      },
    );
  });
}

// CREATE
export async function addStory(storyBody) {
  if (typeof storyBody !== 'string') {
    throw new TypeError('story body must be a string');
  }
  await writeDatabase([...state, {id: uid(), votes: 0, body: storyBody}]);
}

// READ
export async function getStories() {
  return state;
}

// UPDATE
export async function voteStory(id) {
  await writeDatabase(
    state.map(story => {
      if (story.id !== id) {
        return story;
      }
      return {id: story.id, votes: story.votes + 1, body: story.body};
    }),
  );
}
