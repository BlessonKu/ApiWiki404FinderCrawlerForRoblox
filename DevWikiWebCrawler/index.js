// DevWikiWebCrawler
// dispeller 02/24/2021
// Took me roughly 30 minutes to finish crawling (depends on your internet speed)

const puppeteer = require("puppeteer")
const fs = require('fs');
var arrayOfAllLinks = []; // Will contain every api-refrence url
var arrayOf404Links = []; // Will contain every 404 page {LinkThatLeadsTo404,UrlWhereLinkIsFrom}
var linkIsFrom = []; // Remember link/URL where each link is from

function addToArrayIfNotExist(array,element){
  let doesExist = array.indexOf(element) === -1;
  if (doesExist)
    array.push(element)
  return doesExist;
}

// Grabs every href in every <a> element on page
async function grabLinksFromPage(page,url){
  await page.goto(url); // Go to page

  // If we land on a 404 page
  if (page.url().includes("404")){
    console.log("404 page found!")
    arrayOf404Links.push([url,linkIsFrom[url]])
    return
  }

  const hrefs = await page.$$eval('a', as => as.map(a => a.href)); // Get all hrefs
  let numberOfNewLinksAdded = 0;
  for(var i=0; i<hrefs.length; i++) { // Add hrefs to list of all links
    var pathArray = hrefs[i].split('/');
    //var protocol = pathArray[0];
    var host = pathArray[2];
    // Make sure the link is an api-refrence and also make sure link's not a jump-to link
    if ((host=="developer.roblox.com") && hrefs[i].includes("api-reference") &&!hrefs[i].includes("#")){
      let doesNotExist = addToArrayIfNotExist(arrayOfAllLinks,hrefs[i])
      if (doesNotExist){
        numberOfNewLinksAdded++;
        linkIsFrom[hrefs[i]] = url;
      }
    }
  }
  console.log(numberOfNewLinksAdded,"new links added from ",url," (",arrayOfAllLinks.length," total)")
}

async function start(){
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });

  const page = await browser.newPage();
  let startURL = "https://developer.roblox.com/en-us/api-reference"

  var currentTimeInSeconds = new Date().getTime() / 1000;

  console.log("START PAGE: ",startURL)
  console.log("STARTING WEB CRAWLING...")

  await grabLinksFromPage(page,startURL)

  // Loop through every link and grab links
  let currentIndex = 0
  do {
    await grabLinksFromPage(page,arrayOfAllLinks[currentIndex])
    currentIndex++;
  } while (currentIndex < arrayOfAllLinks.length) //(currentIndex!=5)//

  // Display finished message
  console.log("DONE!")
  console.log(arrayOfAllLinks.length,' links collected in total!')

  // Calculate how much time it took
  var timeItTook = (new Date().getTime() / 1000) - currentTimeInSeconds
  console.log("Took ",timeItTook," seconds to finish!")

  // Export data as json

  await fs.writeFile('AllLinks.json', JSON.stringify(arrayOfAllLinks), function(err) {
    if (err) throw err;
    console.log('All links are exported');
  });

  await fs.writeFile('404Links.json', JSON.stringify(arrayOf404Links), function(err) {
    if (err) throw err;
    console.log('arrayOf404Links are exported!');
  });

  console.log("FINISHED EXPORTING! EXITING BROWSER")
  browser.close();

}

start();
