# Bulletproof React workshop

## Manual Testing

Before we get started, check that everything's working.

---

**Exercise A**

```
npm start
```

You should then be able to load up a simple web app at http://localhost:3000.  It should let you add a few stories, and then vote stories up.  Clearly it's a very simple app, it lets anyone vote things up an unlimited number of times.

---

The source code for the app all lives in the `src` folder, and is compiled via babel so we can use the latest JavaScript features.  It consists of a node.js server in `src/servers.js` and a react application in `src/client.js`.  Take a moment to familiarise yourself with the code.

## End To End Tests

> An end to end test will let us quickly check that all the code we've written works together. It's not very useful for telling us what is broken, but it's great for telling us that _something_ is broken.  We want at least one of these (for larger apps you'd have a few of these, but you always want far more of other types of tests).

---

**Exercise B**

Create the file `src/end-to-end-tests/index.js` containing the code `console.log('end to end test');`. Add a script to package.json using:

```diff
  "scripts": {
+   "test:e2e": "babel-node src/end-to-end-tests/index.js"
  },
```

Check that you can run this test using `npm run test:e2e`. It should print `end to end test`.

---

### chromedriver

> chromedriver provides an API that our end to end tests can use to automate interactions with google chrome.  We can then access this API from cabbie.

---

**Chore**

Extract the relevant zip file in the chromedriver folder.  This should provide you with an executable for your platform.  Run this in a separate tab.

---

### cabbie

> cabbie is a library for controlling browsers.  It can talk to any "webdriver" compatible backend.  We'll use chromedriver today, but you might want to use something like browserstack or saucelabs in a continuous integration environment.  Cabbie has both a synchronous, and an asynchronous version.  We'll use the sync version today, because it's easier to use.

---

**Exercise C**

In `src/end-to-end-tests/index.js`, try the following example code. N.B. You will need to be running chromedriver and the app in other tabs.

```js
import assert from 'assert';
import uid from 'uid';
import cabbie from 'cabbie-sync';

// get a browser instance that we can control
const driver = cabbie('chromedriver', {debug: true});

try {
  // navigate to the url in the currently active window
  driver.browser.activeWindow.navigator.navigateTo(
    'http://localhost:3000',
  );

  const id = uid();

  // select the text box and type some text
  driver.browser.activeWindow
    .getElement('[data-test-id="NewStoryBody"]')
    .sendKeys('TEST:' + id);

  // select the button and click it
  driver.browser.activeWindow
    .getElement('[data-test-id="AddStoryButton"]')
    .mouse.click();

  // get the story once it appears, it might not appear instantly
  const story = waitFor(() => getStoryWithText('TEST:' + id));
  assert(story, 'Expected a story to appear within 5 seconds');
} finally {
  // whether tests pass or fail, dispose of the driver
  driver.dispose();
  serverProcess.kill();
}
process.exit(0);

function getStoryWithText(text) {
  // there's no way to select an element with some given text, so select all the stories
  const stories = driver.browser.activeWindow.getElements(
    '[data-test-id="story"]',
  );
  for (const story of stories) {
    // for each of the stories, check to see if it includes the text we're checking for
    if (
      story
        .getElement('[data-test-id="StoryBody"]')
        .getText()
        .includes(text)
    ) {
      return story;
    }
  }
  return null;
}

// retry a function until it returns something truthy
// by default, this will wait up to 5000
function waitFor(fn, timeout = 5000) {
  const timeoutEnd = Date.now() + timeout;
  while (Date.now() < timeout) {
    const value = fn();
    if (value) {
      return value;
    }
  }
  return fn();
}
```

---

**Exercise D**

Extend the end to end test by:

1. checking that the vote count starts at "0"
2. clicking the vote button
3. checking that the vote count _eventually_ becomes "1"

---

## Jest Testing

> Jest is a testing framework. It's a very "batteries included" solution. It provides things like code-coverage out of the box.

> Jest tests are great at telling you exactly where a problem is, you should aim to have jest tests for most modules and most code paths, but it can be hard to get 100%.

### Snapshots

---

**Exercise E**

Create a file called `src/components/__tests__/Spinner.test.js` and put the following code in it:

```js
import React from 'react';
import renderer from 'react-test-renderer';
import Spinner from '../Spinner';

test('Spinner', () => {
  expect(renderer.create(<Spinner />).toJSON()).toMatchSnapshot();
});
```

Add another script to the package.json file:

```diff
  "scripts": {
+   "test": "jest src"
  },
```

Run `npm test` and jest should run your test.

---

It finds it based on the filename, which makes it easy to keep your test close to the component.  You should also see that it generates a new "snapshots" folder.  Try changing what gets rendered by the Spinner, and re-running the test.  You should see the test fails, but you can update it by running `npm test -- -u`.

**N.B.** you should commit snapshots to your repository, that way changes to the snapshots can be reviewed as part of the code review process.

---

**Exercise F**

Add another snapshot test, this time for the `App` component.  You should ideally add three snapshot tests:

1. the loading state
2. when there are no stories
3. when there are a few stories

---

### Enzyme

Enzyme lets you mount a component and simulate events on that component.  For example:

```js
import React from 'react';
import {mount} from 'enzyme';

test('button click', () => {
  const onClick = jest.fn();
  const wrapper = mount(<button onClick={onClick} />);
  wrapper.find('button').simulate('click');
  expect(onAddStory.mock.calls.length).toEqual(1);
});
```

---

**Exercise G**

Add a test for the AddStoryContainer.  It should:

1. change the text in the input `wrapper.find('input').simulate('change', {target: {value: 'Hello World'}});`
2. submit the form `wrapper.find('form').simulate('submit');`
3. check that the `onAddStory` method was called with the text body as its argument

---

## flow

> Automated verification of your entire program. It can check that your assumptions about types (the body is a string, the vote count is a number) are never violated.

---

**Exercise H**

Add another script to the package.json file:

```diff
  "scripts": {
+   "flow": "flow"
  },
```

Run `npm run flow`

You should see `No errors!` printed out to the terminal (this might take a few seconds).

Try adding a comment to the top of each file in `components` that says `// @flow`.  This enables flow for these files.  Running `npm run flow` should now give you a list of errors.

Add the following type declaration to the `AddStory` component:

```js
type Props = {|
  +body: string,
  +onSubmit: (e: SyntheticInputEvent) => mixed,
  +onChangeBody: (e: SyntheticInputEvent) => mixed,
|};
```

> (The `|` at the beginning and end mean that no other props may be passed. The `+` means that these properties are read-only, this is almost always what you want).

You can then replace `(props)` with `(props: Props)` in the function arguments to use this type declaration.  For Containers, you would add the following as the first line of the class's body:

```js
props: Props;
```

Repeat this process of adding types to each component until there are no more flow errors.

---
