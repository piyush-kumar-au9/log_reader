import fs from 'fs';


function readFile(fileName:string) {
    let fileData: string = fs.readFileSync(fileName, 'utf-8');
    let regex: RegExp = /GET .*? \d\d\d/g;

    let filteredAPI = [fileData.match(regex)];

    function getCount(data: string[], searchValue: string) {
        return data.filter((x: string) => x === searchValue).length;
    }

    var globalObj: {}[] = [];
    if (filteredAPI[0] !== null) {
        let unique_data = [...new Set(filteredAPI[0])];
        for (let i of unique_data) {
            let obj = {
                [i]: { count: getCount(filteredAPI[0], i) }
            }
            globalObj.push(obj);
        }
    }

    return globalObj;

}


const result = readFile("./logFiles/api-prod-out.log");

