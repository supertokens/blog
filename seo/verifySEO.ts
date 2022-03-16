// packages
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import Axios from "axios";

// tests
import canonicalTest from "./tests/canonical";
import h1TagCheck from "./tests/single-h1";

// console log colors
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

// global counters for tests passed and failed.
let successfulTests = 0;
let failedTests = 0;

// list of routes that returned 404s
const routesThatReturned404: string[] = [];

// helper functions to print stuff
const logFailure = (msg: string) => {
  console.log(`\t\t${RED}✗ ${msg}${RESET}`);
  failedTests++;
};

const logSuccess = (msg: string) => {
  console.log(`\t\t${GREEN}✓ ${msg}${RESET}`);
  successfulTests++;
};

// directory to be tested, and it's absolute and relative path
const testedDir = "public/blog";
const testedDirRelativePath = `../${testedDir}`;
const testedDirAbsolutePath = path.join(__dirname, testedDirRelativePath);
const urlPathPrefix = "/blog";

// path blacklist
const blacklist: string[] = [];

// path redirect
const redirectList: {
  [key: string]: string
} = {};

// paths that cannot be generated from files
const otherPathsToTest: string[] = [];

// returns a localhost url using the path
function buildUrl (path: string): string {
  return path.startsWith("/")
  ? `http://localhost:9001${urlPathPrefix}${path}`
  : `http://localhost:9001${urlPathPrefix}/${path}`;
}

/**
 * returns lists of HTML files and directories in a specific directory
 * @param parent path of the parent directory
 * @param currentDirectory name of the current directory
 * @returns an object with lists of files and directories in a directory as properties
 */
async function getDirectoriesAndFiles (pathToDirectory: string): Promise<{
  files: fs.Dirent[],
  directories: fs.Dirent[]
}> {
  return new Promise((resolve, reject) => {
    try {
      const contents = fs.readdirSync(path.join(pathToDirectory), {
        withFileTypes: true
      });

      const files = contents.filter((item: fs.Dirent) => item.isFile() && item.name.endsWith(".html"));
      const directories = contents.filter((item: fs.Dirent) => !item.isFile());

      resolve({
        files,
        directories
      });
    } catch (error) {
      reject(error);
    }
  });
}

function runTestsOnPage (path: string) {
  const url = buildUrl(path);

  return new Promise(async (resolve, reject) => {
    try {
      const response = await Axios.get(url);
      const fileContent = response.data;
      const dom = cheerio.load(fileContent);

      const testParameters = {
        dom,
        logSuccess,
        logFailure
      };

      // tests to run on this page
      await canonicalTest(testParameters);
      await h1TagCheck(testParameters);

      resolve(true);
    } catch (error) {
      if (error.response.status === 404) {
        console.log("\t\tError 404: ", url);
        routesThatReturned404.push(url);
      }
      resolve(error);
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

          let directoryPathInsideTestedDir = pathToDirectory.split(testedDirAbsolutePath)[1];

          // go to the next file if this file should be blacklisted.
          const shouldBeBlacklisted = blacklist.some((path) => {
            return directoryPathInsideTestedDir.startsWith(path);
          });
          if (shouldBeBlacklisted) {
            continue;
          }

          // check if the path of this file needs to be replaced
          if (
            directoryPathInsideTestedDir !== undefined &&
            Object.keys(redirectList).includes(directoryPathInsideTestedDir)
          ) {
            directoryPathInsideTestedDir = redirectList[directoryPathInsideTestedDir];
          }

          console.log("\n\t📄 %s", directoryPathInsideTestedDir);
          console.log("\t🔗 %s", buildUrl(directoryPathInsideTestedDir));
          await runTestsOnPage(directoryPathInsideTestedDir);
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
      reject(error);
    }
  });
}

// tests for routes that cannot be generated from files e.g. React pages
function testRoutesWithoutHTML () {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("\n\n📁 Running tests on paths without HTML files");

      for (const otherPath of otherPathsToTest) {
        console.log("\n\t🔗 %s", buildUrl(otherPath));
        await runTestsOnPage(otherPath);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

function printTestResults () {
  console.log(`\n${GREEN}Total ${successfulTests} test(s) passed.${RESET}`);

  if (failedTests > 0) {
    console.log(`${RED}Total ${failedTests} test(s) failed.${RESET}`);
  } else {
    console.log(`Total ${failedTests} test(s) failed.`);
  }

  if (routesThatReturned404.length > 0) {
    console.log(`\t${RED}The following routes returned error 404.${RESET}`);
    for (const route of routesThatReturned404) {
      console.log(`\t${RED}${route}${RESET}`);
    }
  }
}

// run the tests
(async () => {
  try {
    console.log("\n⏳ Testing the built files for SEO issues...");

    console.log("\n📁 %s", testedDir);

    await testHtmlPages(__dirname, testedDirRelativePath);
    await testRoutesWithoutHTML();

    printTestResults();

    console.log("\n👋 All tests completed.\n");

    if (failedTests > 0 || routesThatReturned404.length > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.log(error);
    process.exitCode = 2;
  }
})();
