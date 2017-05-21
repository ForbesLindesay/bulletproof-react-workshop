import assert from 'assert';
import {resolve} from 'path';
import {fork} from 'child_process';
import cabbie from 'cabbie-sync';
import getPort from 'get-port';
import uid from 'uid';

getPort().then(port => {
  const serverProcess = fork(resolve(__dirname + '/../../server.js'), [], {
    env: {PORT: port},
  });
  serverProcess.on('message', msg => {
    if (msg !== 'started') {
      return;
    }
    // connect to chromedriver, adding {debug: true} makes cabbie log each method call.
    const driver = cabbie('chromedriver', {debug: true});

    try {
      // navigate to the url in the currently active window
      driver.browser.activeWindow.navigator.navigateTo(
        'http://localhost:' + port,
      );

      const id = uid();
      driver.browser.activeWindow
        .getElement('[data-test-id="NewStoryBody"]')
        .sendKeys('TEST:' + id);
      driver.browser.activeWindow
        .getElement('[data-test-id="AddStoryButton"]')
        .mouse.click();

      // allow 5 seconds for the element to appear
      const timeout = Date.now() + 5000;
      const story = waitFor(() => getStoryWithText('TEST:' + id));
      if (story === null) {
        throw new Error('Story was not created');
      }
      assert(
        story.getElement('[data-test-id="VoteCount"]').getText().trim() === '0',
        'Expect vote count to start at 0',
      );
      story.getElement('[data-test-id="AddVote"]').mouse.click();

      assert(
        waitFor(
          () =>
            story.getElement('[data-test-id="VoteCount"]').getText().trim() ===
            '1',
        ),
        'Expect vote count to be 1 after clicking on the element',
      );
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
  });
});
