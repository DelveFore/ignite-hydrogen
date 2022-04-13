# Ignite Hydrogen


> This product is deprecated due to Ignite Red no longer supporting other tooling like this one. Instead this project will reform into using the underlining tools from Ignite Red (e.g. Gluegun)



--- 

Extending from fantastic and hotest React Native boilerplate [Ignite Red's Bower](https://github.com/infinitered/ignit-bower), the Ignite Hydrogen project is aimed at easily implementing principles and concepts from DelveFore to a specific purpose (more to come soon!).

> In everyway those contributing `Hydrogen` want to promote the people and along with efforts of Ignite Red for these open source projects. Please check out ways to support their efforts and the open source community!

## Concepts

(see roadmap for details including GraphQL and Mobx-State-Tree support)

- Finite State Machine with asynchornous state management (via Saga and Redux)
- Atomic Design UI Library implementing BEM and View Styling separation
- Data structure abstraction from external asynchronous APIs

Includes:

- React Native
- React Navigation 5
- Reactotron (requires 2.x)
- State Machine
  - Redux (optional)
    - Redux Sauce
    - Saga Sauce
  - Mobx State Tree (optional)
- UI
  - NativeBase (alternatives coming soon)
- API
  - jsonapi.org
  - GraphQL (coming soon)
- And more!

## Quick Start

Prerequisites:

- For classic React Native: -- choose React Native CLI
  - [React Native](https://shift.infinite.red/painless-react-native-setup-for-mac-windows-linux-956c23d2abf9)
  - [install the React Native CLI](https://facebook.github.io/react-native/docs/getting-started)
- For Expo: [install the Expo CLI](https://facebook.github.io/react-native/docs/getting-started) -- choose Expo CLI
  - _Note:_ Expo support is experimental.

Install Ignite CLI globally:

```
npm install -g ignite-cli
# or
yarn global add ignite-cli
```

**Note:**
Make sure you have [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) installed because otherwise, React Native installation will fail.

Then spin up a new Bowser-powered React Native app:

```
ignite new MyApp -b hydrogen
```

`cd` into your new app and run `react-native run-ios` or `react-native run-android` (note: in Android, you'll need an Android emulator running or an Android phone attached).

You should see an app that looks like the screenshot above!

Next step -- follow this tutorial to learn how to create a trivia app with Ignite Bowser: https://shift.infinite.red/creating-a-trivia-app-with-ignite-bowser-part-1-1987cc6e93a1

## Code Styles

One major departure from Ignite Red's Bowser is the code style choices, the team managing the Hydrogen project(s) chose to use StandardJS styling which brought `'` vs `"` usage among a few other differences.

## Generators

The true gem of Ignite Hydrogen. Generators help you scaffold your app very quickly, be it for a proof-of-concept, a demo, or a production app. Generators are there to save you time, keep your code consistent, and help you with the basic structure of your app.

```
ignite generate
```

Will give you information of what generators are present.

### Component generator

This is the generator you will be using most often. There are 2 flavors:

- Wrapped with mobx-react-lite's `observer` function - you need this if you
  pass any mobx-state-tree objects as props to the component, and the component
  will dereference properties of those objects.
- Plain, not wrapped with `observer`. If you're only passing plain values or
  non-MST objects, this is fine.

```
ignite generate component awesome-component
```

- Creates the component/function
- Creates a style file
- Creates a storybook test
- Will make the required additions to configuration files.

You can also bypass the choice by providing which component type you want to create:

```
ignite generate component AwesomeComponent --function-component
```

Or

```
ignite generate component AwesomeComponent --stateless-function
```

### Screen generator

Generates a "hooks enabled" screen.

```
ignite generate screen awesome-screen
```

- Creates the screen

### State Module generator

Creates a Saucy Saga powered "Redux module"

```
ignite generate state awesome-model
```

- Creates the state module
- Creates a unit test file
- Will make the required additions to configuration files.

### Advanced

The built in generators aren't enough? Fret not, you can create your own generators that suit your project/company. These generators can live with the default ignite-bowser generators.

Please refer to the [documentation on how to create your own generators.](https://github.com/infinitered/ignite/blob/master/docs/advanced-guides/creating-generators.md)

## Explanation of folder structure

The Ignite Bowser boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── i18n
│   ├── state
│   ├── navigation
│   ├── screens
│   ├── services
│   ├── theme
│   ├── utils
│   ├── app.tsx
|   ├── assets
│   ├── fonts
│   ├── images
├── storybook
│   ├── views
│   ├── index.ts
│   ├── storybook-registry.ts
│   ├── storybook.ts
├── test
│   ├── __snapshots__
│   ├── storyshots.test.ts.snap
│   ├── mock-i18n.ts
│   ├── mock-reactotron.ts
│   ├── setup.ts
│   ├── storyshots.test.ts
├── README.md
├── android
├── ignite
│   ├── ignite.json
│   └── plugins
├── index.js
├── ios
└── package.json
```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
│── components
│── i18n
├── state
├── navigation
├── screens
├── services
├── theme
├── utils
├── app.tsx
```

**components**
This is where your React dumb components will live. Each component will have a directory containing the `.tsx` file, along with a story file, and optionally `.presets`, and `.props` files for larger components. The app will come with some commonly used components like Button.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**state**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc. There's also an extensions directory with useful shared extensions that you can include in your models like `.extend(withRootStore)` or `.extend(withEnvironment)` to access the root store or environment respectively.

**navigation**
This is where your `react-navigation` navigators will live.

For a walkthrough about how React Navigation v5 works, check out Harris Robin's post: [Getting Started with the New React Navigation v5 and Ignite Bowser v5](https://shift.infinite.red/getting-started-with-the-new-react-navigation-v5-and-ignite-bowser-v5-31fb4a57f2b9).

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography. For help with adding custom fonts to your application, [check out the readme in ./assets/fonts/](./boilerplate/assets/fonts/custom-fonts.md).

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application. This is also where you will specify whether you want to run the app in storybook mode.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find generators, plugins, and examples to help you get started with React Native.

### ./storybook directory

This is where your stories will be registered and where the Storybook configs will live

### ./test directory

This directory will hold your Jest configs and mocks, as well as your [storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) test file. This is a file that contains the snapshots of all your component storybooks.

# About The Stack

- API Spec Integrations: [Why GraphQL and JSON:API](docs/http-api-integration.md)
- State Machines Integration: [Why Redux and Mobx State Tree](docs/state-machine-integration.md)

## Upgrade

To keep your React Native app updated:

- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) great web based tool
- [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge)

To keep your Ignite Bowser based app updated:

- [ignite-bowser-diff-purge](https://github.com/nirre7/ignite-bowser-diff-purge) To help you see the diffs between versions

## TypeScript

In addition to `redux` --> `mobx-state-tree`, we've also transitioned to using `TypeScript` vs plain `JavaScript`. We find that TypeScript streamlines the developer experience by catching errors _before_ you hit refresh on that simulator, and prevents costly bugs by enforcing type safety.

In Bowser, TypeScript is fully set up, so if you know TS, all you need to do is start coding!

### Resources

If you are new to TypeScript, here are some of our favorite resources:

- [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) for a quick read
- [TypeScript in 50 minutes](https://youtu.be/WBPrJSw7yQA) for a longer watch
- [Execute Program -- TypeScript course](https://www.executeprogram.com/course/typescript) -- free course by Gary Bernhardt
- [TypeScript and VSCode](https://code.visualstudio.com/docs/typescript/typescript-tutorial) for awesome developer tools
- [Official Docs](https://www.typescriptlang.org/docs/home.html)

## Contribute

When contributing back to the project the recommended way is to integrate it with an example project. The follow are steps to making that happen.

Clone this project to a directory similar to ~/Development or where ever you put your development projects, then...

```bash
cd ignite-hydrogen
yarn link
cd ..
ignite new HydrogenExample -b ./ignite-hydrogen
# answer the prompts
cd HydrogenExample
yarn link "ignite-hydrogen"
```

Now you're able to make changes in the `ignite-hydrogen/boilerplate` and then in your example project do `ignite generate boilerplate`. Keep in mind, this will overrite the existing files of the path in your `HydrogenExample` project.

## Premium Support

While Hydrogen is an open sourcep project and Github issues can provide most of the support, please contact DelveFore for premimum support, **coaching**, and general design/development services (see www.delvefore.com and www.delvefore.com/#Get-Started)
_ALSO_ **[Infinite Red](https://infinite.red/)** offers premimum support for Ignite CLI and **general mobile app design/development services.**

[Ignite CLI](https://infinite.red/ignite) as open source projects, are free to use and always will be.
Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.

