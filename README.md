# ApiWiki404FinderCrawlerForRoblox
searches through Roblox's Api wiki to find 404 pages

## Recommended setup
1. Have npm installed
2. CD into the folder w/ index.js
3. Read through and modify the code if you want. Around line 36 is what you'd wanna modify to increase the scope.
4. run "node ." or "npm start"
5. Let it run. It took me a little less than 30 minutes.

This is the list of 404 pages I got as of 02/24/2021
https://pastebin.com/raw/w9CA13bF
There are 48 links

Structure of json:
```
[
  [ BrokenLinkURL, OriginURL],
  [ BrokenLinkURL, OriginURL],
  [ BrokenLinkURL, OriginURL],
  ...
]
```
