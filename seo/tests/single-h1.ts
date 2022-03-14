/**
 * Test if the page has exactly 1 h1 tag defined.
 */
import { Page } from "puppeteer";

interface Parameters {
  page: Page;
  logSuccess: Function;
  logFailure: Function;
}

export default function ({page, logSuccess, logFailure}: Parameters): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const h1Tags = await page.$$("h1");

      if (h1Tags.length === 1) {
        logSuccess("Exactly 1 h1 tag present.");
        resolve(true);
      } else if (h1Tags.length > 1) {
        logFailure("More than 1 h1 tags present.");
        resolve(false);
      } else {
        logFailure("No h1 tag present");
        resolve(false);
      }
    } catch (error) {
      console.log(error);
      reject("error occured while checking for exactly 1 h1 tag");
    }
  });
}