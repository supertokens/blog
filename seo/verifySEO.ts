// packages
import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";

// types
import { Dirent } from "fs";
import { Browser, Page } from "puppeteer";

// tests
import canonicalTest from "./tests/canonical";

// console log colors
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

// global variables for browser and page
let browser: Browser;
let page: Page;

// global counters for tests passed and failed.
let successfulTests = 0;
let failedTests = 0;

// helper functions to print stuff
const logFailure = (msg: string) => {
  console.log(`\t\t${RED}✗ ${msg}${RESET}`);
  failedTests++;
};

const logSuccess = (msg: string) => {
  console.log(`\t\t${GREEN}✓ ${msg}${RESET}`);
  successfulTests++;
};

// minimal args for puppeteer
const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain"
];

/**
 * returns lists of HTML files and directories in a specific directory
 * @param parent path of the parent directory
 * @param currentDirectory name of the current directory
 * @returns an object with lists of files and directories in a directory as properties
 */
async function getDirectoriesAndFiles (pathToDirectory: string): Promise<{
  files: Dirent[],
  directories: Dirent[]
}> {
  return new Promise((resolve, reject) => {
    try {
      const contents = fs.readdirSync(path.join(pathToDirectory), {
        withFileTypes: true
      });

      const files = contents.filter((item: Dirent) => item.isFile() && item.name.endsWith(".html"));
      const directories = contents.filter((item: Dirent) => !item.isFile());

      resolve({
        files,
        directories
      });
    } catch {
      reject({
        files: [],
        directories: []
      });
    }
  });
}

function runTestsOnPage (path: string) {
  return new Promise(async (resolve, reject) => {
    try {
      await page.goto(`file://${path}`);
      await canonicalTest({page, logSuccess, logFailure});
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function testHtmlPages (parent: string, currentDirectory: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const pathToDirectory = path.join(parent, currentDirectory);
      const { files, directories } = await getDirectoriesAndFiles(pathToDirectory);

      // html files exist
      if (files !== null && files !== undefined && files.length > 0) {

        for (const file of files) {
          const filePath = path.join(pathToDirectory, file.name);
          console.log("\n\t📄 %s", filePath);
          await runTestsOnPage(filePath);
        }
      }

      // directories exist, search for files inside the directories
      if (directories !== null && directories !== undefined && directories.length > 0) {
        for (const directory of directories) {
          await testHtmlPages(path.join(parent, currentDirectory), directory.name);
        }
      }

      resolve(true);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

function printTestResults () {
  console.log(`\n\t${GREEN} Total ${successfulTests} tests passed.${RESET}`);
  console.log(`\t${RED} Total ${failedTests} tests failed.${RESET}`);
}

// create the puppeteer browser and initiate tests
// close it once the tests are done
(async () => {
  try {
    console.log("⏳ Spinning up a browser...");

    browser = await puppeteer.launch({
      headless: true,
      args: minimal_args
    });
    page = await browser.newPage();

    console.log("🚀 Browser started.");

    await testHtmlPages(__dirname, "../public/blog");

    printTestResults();

    await browser.close();

    console.log(`\n👋 Browser closed.`);

    if (failedTests > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.log(error);
  }
})();
