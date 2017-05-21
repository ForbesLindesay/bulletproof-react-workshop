// @flow

import React from 'react';
import {mount} from 'enzyme';
import AddStoryContainer from '../AddStoryContainer';

test('AddStoryContainer', () => {
  const onAddStory = jest.fn();
  const wrapper = mount(<AddStoryContainer onAddStory={onAddStory} />);
  wrapper.find('input').simulate('change', {target: {value: 'Hello World'}});
  wrapper.find('form').simulate('submit');
  expect(onAddStory.mock.calls).toEqual([['Hello World']]);
});
