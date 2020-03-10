# LocLoc

A single-view application for showing a user their own location data. Fetches a users location in the background and logs it for them to see.

Branches:

`expo`: uses the expo implementation for BackgroundTasks.

- pros: easy to implement on both ios and android
- cons: cannot set a background fetch time interval for ios.

`ejected`: uses the `react-native-background-timer` package. pros and cons are basically the opposite of `expo`'s
