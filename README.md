# Wish List UI

This is a project early in development for creating and buying from wish lists. My family during birthdays and Christmas always exchanges Google docs containing what gifts they'd like to receive.

The problem is, it's difficult to coordinate among a large group of people who is buying what. Doing so in the doc would spoil the surprise whenever the doc's author goes in to edit it. Doing it offline via text is hard to track.

Thus, I try to create a web interface that will (eventually) make this problem go away.

## Current state
It's really just a simple list in a GCP firestore. You login with Google, and can add and delete list items with a title and description. You can also delete them.

## Still to come
Some features I hope to develop soon:
### List authoring
  * Re-order items in the list via drag & drop
  * Allow multiple lists per user
  * Allow list items to appear in multiple lists
  * Dedicated link fields for products
  * Sections, sub-lists
  * Filter & sort by price

### List sharing
  * Share lists with other users
  * Select lists shared with you for viewing
  * Allow for anonymous (for polyanna/secret santa) & non-anonymous coordination
  * Allow gift-givers to solicit for "chipping in" on more expensive items
  * Virtually pick names out of a hat for Polyanna/Secret Santa, and assign the proper list to you 

---

Below is some create-react-app boilerplate that's still useful

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
