import fs from "fs";
import "dotenv/config";

export const autoDelete = () => {
  const tempFiles = fs.readdirSync("./temp");
  if (tempFiles?.length) {
    //applying binary serach to find the files that are older than 10mins
    const currentTime = new Date();
    //find time older than 10 mins
    const timeDiff = currentTime.setMinutes(currentTime.getMinutes() - Number(process.env.DELETE_MINUTES)!);

    //perform binary search find old files
    let left = 0;
    let right = tempFiles.length - 1;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const fileTime = Number(tempFiles[mid].split("-")[0]);
      if (fileTime < timeDiff) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    const oldFiles = tempFiles.slice(0, left);

    //delete these oldFiles from the server
    oldFiles.forEach((file) => {
      if (fs.existsSync(`temp/${file}`)) {
        console.log("file exists")
        fs.unlinkSync(`temp/${file}`)
      }
    });

    return;
  }
  console.log("No data to be deleted");
};
