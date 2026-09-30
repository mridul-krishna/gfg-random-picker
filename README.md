# GFG Random Question Picker

A Chrome extension that helps you pick a random GeeksforGeeks practice problem from the questions currently available on the page.

## Features

- Pick a random question from the current GFG problem list
- Follow the filters currently selected on the GFG page
- See how many questions are available for selection
- Optionally ignore questions that have already been solved
- Load all available questions from the difficulty sections
- Show or hide the Load All button
- Remember your settings between sessions

## How It Works

The extension uses the questions currently available on the GFG practice page as the selection pool.

The Random button follows the filters applied on the page. If Ignore Solved is enabled, solved questions are excluded from the selection.

Load All can be used when you want to include questions that are not initially loaded on the page.

## Installation

1. Clone or download this repository.
2. Extract the repository if it was downloaded as a ZIP.
3. Open `chrome://extensions/` in Google Chrome.
4. Enable Developer mode.
5. Click Load unpacked.
6. Select the project folder containing `manifest.json`.
7. Open a GeeksforGeeks practice problem list.

## Usage

1. Open a GeeksforGeeks practice problem list.
2. Apply the filters you want.
3. Use the Random button to pick a question.
4. Enable Ignore Solved from the extension popup if needed.
5. Use Load All if you want to include all available questions.
6. Use the extension popup to change its settings.

## Changes in V1.1

- Added Load All
- Added Ignore Solved
- Added Show/Hide Load All setting
- Added persistent settings
- Added filter-aware question counts
- Updated the extension UI

## Version

V1.1