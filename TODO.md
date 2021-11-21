# Commit
Set up log statistics services

## Backlog

refactor LogStats with new Schema and pull into backend
  [x] totals
  [x] proportions
  [x] timeline
  [x] graph
  [x] set up log statistics as a service
  [x] add/subtract methods

nestJS + typescript
  [ ] fix using uppercase props in logs

client
  [ ] error boundary for failed sign in / not signed in
  [ ] fix/rewrite diagrams
  [ ] fix patterns in charts (map pattern to type consistently)

styles
  [ ] log property display in a more tabular form
  [ ] indicate tarining type with color (same as in diagrams)
  [ ] fix added paragraph/link in footnotes
  [ ] main margin/padding
    [ ] set 0 on mobile
    [ ] fix on settings page
    [ ] center footer/(nav) positioning

training type configurator

exercise/workout frontend

> 0.1.0

logList
  pagination + "show more" button

> 0.2.0

## Known Bugs

  [Firefox] last log cannot be deleted:
    Uncaught (in promise) TypeError: undefined has no properties

## Plannning

pre-rendering
? filter/pagination
? file field/option
non-google analytics + privacy disclaimer
? weather field
? map/location

# Changelog

## Added
- Log Statistics and visualisation
- Persistent settings per dashboard-block
- A11y improvements (content change announcements, complete heading hierarchy, skip links, colour contrast)
- Nav logo versions and selective header display
## Changed
- Log list sorts by date in descending order
## Fixed
- Enlarged navigation buttons
- Load logs from database only when app starts
- Reload on homepage/dashboard (links now prepend Github root directory)
- Font and button sizes, spacing and positioning issues
