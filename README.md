Guess the Word Desi
==========================

Multilingual puzzle game built using Ionic 1 and Cordova

For game description and app: [Guess the Word Desi](https://play.google.com/store/apps/details?id=com.ionicframework.apptelugu4p1w586229)

## Using this project

### Install Ionic and Cordova ###

`npm install -g cordova ionic`

### Run the App in browser ###

 - Run the game in browser using `ionic Serve`

### Run the App in Android/iOS ###

  - Add Android/iOS platform using `ionic platform add android/ios`
  - Run app for Android/iOS using `ionic run android/ios` which builds and runs the app in emulator or device
  
### Add/Modify puzzles ###

  - Add new puzzles in `puzzles` folder in root directive, with level number as folder name, and solutions placed in `solutions.json`
  - Run `gulp images` which compresses, resizes and renames the image files and moves them to `www/puzzles` folder.
  - Run `gulp solutions` which merges the solutions in each folder, encrypts the solutions in AES format, and generates single `solutions.json`, placed in `www/appData`.
  - Puzzle levels can be reordered by changing folder names with approriate level number and running `gulp puzzles`.

Created by [Gowtham Hosur](https://www.linkedin.com/in/gowtham-hosur) and [Harsha Nooka](https://www.linkedin.com/in/harshanooka) and published under [Indic App Studios](http://www.indicappstudios.com)
