// packages
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

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
  return new Promise(async (resolve, reject) => {
    try {
      // await page.goto(`file://${path}`);

      const fileContent = fs.readFileSync(path);
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
          const filePathInsideTestedDir = filePath.split(testedDirAbsolutePath)[1];

          console.log("\n\t📄 %s", filePathInsideTestedDir);
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
}

// create the puppeteer browser and initiate tests
// close it once the tests are done
(async () => {
  try {
    console.log("\n⏳ Testing the built files for SEO issues...");

    console.log("\n📁 %s", testedDir);

    await testHtmlPages(__dirname, testedDirRelativePath);

    printTestResults();

    console.log("\n👋 All tests completed.\n");

    if (failedTests > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.log(error);
    process.exitCode = 2;
  }
})();
