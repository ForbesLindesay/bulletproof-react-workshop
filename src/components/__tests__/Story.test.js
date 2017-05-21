// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import Story from '../Story';

test('Spinner', () => {
  expect(
    renderer
      .create(
        <Story votes={5} body="A great story" id="akjd" onVote={() => {}} />,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
