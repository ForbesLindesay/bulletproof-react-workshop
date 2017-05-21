// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import AddStory from '../AddStory';

test('AddStory', () => {
  expect(
    renderer
      .create(
        <AddStory
          body="A great story!"
          onChangeBody={() => {}}
          onSubmit={() => {}}
        />,
      )
      .toJSON(),
  ).toMatchSnapshot();
});
