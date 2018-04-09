This script was made to work with the app [Blink: Better Affiliate Links](https://itunes.apple.com/us/app/id946766863?at=1l3vwJx&ct=podcast) to generate affiliate links from Apple's App and iTunes stores. The script does a few different things.

1. If text is selected in Drafts' editor, the selected text will become the search term in Blink. If not, a prompt will appear asking you to enter a search term.
2. The script will ask you if you want to use Blink's Plain or Markdown link style. This does not tell Blink which style to use as Blink has no way of accessing that function programatically. Instead, it tells Drafts how to format the link when it is placed into the editor. Selecting Plain Link will keep the term you selected in the editor and searched for, but wrap it in a markdown link. Selecting Markdown link will completely replace your search term with the official title from Apple's store and enclose that in a markdown link.
3. The script will insert the link in the style that you previously selected once it receives the link from Blink.

This script works best as a keyboard action instead of in an action list.