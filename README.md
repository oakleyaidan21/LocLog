# LocLoc

A single-view application for showing a user their own location data. Fetches a users location in the background and logs it for them to see.

Branches:

`expo`: uses the expo implementation for BackgroundTasks.

- pros: easy to implement on both ios and android
- cons: cannot set a background fetch time interval for ios.

`ejected`: uses the `react-native-background-timer` package. pros and cons are basically the opposite of `expo`'s

## To-Do

1. have app show latest locations without needing to refresh
2. export to csv file instead (or in addition to) email
3. Think of a new name since "LocLog" is already taken
4. Fix warnings
5. Show map of locations marked (stretch)
6. Work on ejected version (stretch)
