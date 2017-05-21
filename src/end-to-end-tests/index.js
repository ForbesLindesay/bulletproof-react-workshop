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
      let story = null;
      while (story === null && Date.now() < timeout) {
        const stories = driver.browser.activeWindow.getElements(
          '[data-test-id="story"]',
        );
        stories.some(storyElement => {
          if (
            storyElement
              .getElement('[data-test-id="StoryBody"]')
              .getText()
              .includes('TEST:' + id)
          ) {
            story = storyElement;
            return true;
          }
        });
      }
      if (story === null) {
        throw new Error('Story was not created');
      }
      assert(
        story.getElement('[data-test-id="VoteCount"]').getText().trim() === '0',
        'Expect vote count to start at 0',
      );
      story.getElement('[data-test-id="AddVote"]').mouse.click();

      const voteTimeout = Date.now() + 5000;
      while (
        Date.now() < voteTimeout &&
        story.getElement('[data-test-id="VoteCount"]').getText().trim() !== '1'
      );
      assert(
        story.getElement('[data-test-id="VoteCount"]').getText().trim() === '1',
        'Expect vote count to be 1 after clicking on the element',
      );
    } finally {
      // whether tests pass or fail, dispose of the driver
      driver.dispose();
      serverProcess.kill();
    }
    process.exit(0);
  });
});
