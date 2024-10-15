# uOttawaRMP
Rate My Professors extension for the uOttawa course portal. Based on the [YorkURMP](https://github.com/mahfoozm/YorkURMP) extension.

This extension works on both the schedule page and course enrolment page.

Pulls data from the Rate My Professors GraphQL API (https://www.ratemyprofessors.com/graphql)

[Chrome Web Store](https://chrome.google.com/webstore/detail/yorkurmp/cdhfogbjpedkpmapnddalehbjdjahfmp?hl=en)

## Screenshots

The extension icon will show up in the browser toolbar when navigating uOttawa's course selection portal. To use the extenson, simply click the icon.

![PageAction](https://i.imgur.com/QzPqYxZ.png)

Currently, the extension will display the professors RMP rating, avg difficulty, percentage of students that would take again, and num of ratings with a hyperlink to the prof's RMP page.

![Normal response](https://i.imgur.com/TplbWX7.png)

This extension can only be added as an unpacked extension (on chrome) for the time being, as it needs to be converted from MV2 to MV3 to be uploaded on the Chrome Web Store. See the releases tab for an easier download & installation instructions. 

Safari support was recently added, however Apple requires that developers purchase a $99 license to publish Safari extensions (no thanks). I've built the extension for Safari anyways and added it to the latest release in case it's possible to install Safari extensions outside of the app store, but I'm not sure if this is possible.

## Modifying to use with other university course portals

Adapting this extension for use with other universities should be easy-- just change SCHOOL_ID to match your school's unique ID, and then modify the document.querySelectorAll() method to work with your course portal (find the element in which professor names are stored on your universities course portal, and modify querySelectorAll to look for this element). You might need to change the way professor info is displayed on the course portal. Remember to update permissions in manifest.json to match your course portals URL. 
