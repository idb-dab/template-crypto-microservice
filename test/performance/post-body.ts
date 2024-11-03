import * as fs from "fs";
const filePath = "test/performance/data/testdata.csv";
let postData;

const generatePostBody = async (userContext, events, done) => {
    try {
        if (postData === undefined || postData === null || postData.length === 0) {
            postData = await loadDataFromTxt(filePath);
        }
        const postBodyStr = postData[Math.floor(Math.random() * postData.length)];
        userContext.vars.data = JSON.parse(postBodyStr);
        return done();
    } catch (err) {
        console.log(`Error occurred in function generatePostBody. Detail: ${err}`);
        throw (err);
    }
}

const loadDataFromTxt = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data.toString().split("\n"));
        });
    });
}

module.exports.generatePostBody = generatePostBody;
