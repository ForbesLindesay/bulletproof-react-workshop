// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import Spinner from '../Spinner';

test('Spinner', () => {
  expect(renderer.create(<Spinner />).toJSON()).toMatchSnapshot();
});
