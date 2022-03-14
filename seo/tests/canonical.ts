/**
 * Test if the page has a canonical link defined
 */
import { load } from "cheerio";

interface Parameters {
  dom: ReturnType<typeof load>;
  logSuccess: Function;
  logFailure: Function;
}

export default function ({dom, logSuccess, logFailure}: Parameters): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const canonical = (await dom("link[rel=\"canonical\"]")).html();
      if (canonical === null || canonical === undefined) {
        logFailure("no canonical link present");
        resolve(false);
      } else {
        logSuccess("canonical link present");
        resolve(true);
      }
    } catch (error) {
      console.log(error);
      reject("error occured while checking for canonical link");
    }
  });
}