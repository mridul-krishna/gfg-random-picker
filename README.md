# GFG Random Question Picker

A Chrome extension that randomly selects a problem from the currently loaded GeeksforGeeks practice problems.

## Features

- Detects GFG problem rows
- Removes duplicate problem entries
- Counts available problems
- Randomly selects a problem
- Opens the selected problem using GFG's own interface
- Loads all available problems with the Load All button
- Can ignore already solved problems
- Shows or hides the Load All button from the extension settings
- Updates the problem count when GFG filters are changed

## How It Works

The extension reads the problems currently displayed on the GFG practice page and uses them as the pool for random selection.

The Random button follows the filters currently applied on the page.

When Ignore Solved is enabled, solved problems are removed from the selection pool.

Load All can be used to load the remaining problems from the visible difficulty sections before picking a question.

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable Developer Mode.
4. Click "Load unpacked".
5. Select the project folder.

## Usage

1. Open a GeeksforGeeks practice problem list.
2. Apply any filters you want on the GFG page.
3. Use the Random button to open a question.
4. Use Load All if you want to include all available problems.
5. Open the extension popup to change settings.

## Version

V1.1