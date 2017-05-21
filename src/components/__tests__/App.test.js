// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

test('App', () => {
  expect(
    renderer
      .create(
        <App
          loading={true}
          stories={[]}
          onAddStory={() => {}}
          onVote={() => {}}
        />,
      )
      .toJSON(),
  ).toMatchSnapshot('loading');

  expect(
    renderer
      .create(
        <App
          loading={false}
          stories={[]}
          onAddStory={() => {}}
          onVote={() => {}}
        />,
      )
      .toJSON(),
  ).toMatchSnapshot('no stories');

  expect(
    renderer
      .create(
        <App
          loading={false}
          stories={[
            {id: 'a', body: 'Awesome story a', votes: 5},
            {id: 'b', body: 'Awesome story b', votes: 3},
          ]}
          onAddStory={() => {}}
          onVote={() => {}}
        />,
      )
      .toJSON(),
  ).toMatchSnapshot('with 2 stories');
});
