// HNG9 Task - Take the CSV provided by the teams, and generate a CHIP-0007 compatible json, 
// calculate the sha256 of the json file and append it to each line in the csv 
// (as a filename.output.csv)


const fs = require('fs')
const crypto = require('crypto')
const csvFilePath='./HNGi9 CSV FILE - Sheet1.csv'
const csv = require('csvtojson')
const converter = require('json-2-csv')
const { ppid } = require('process')
const hashedJson = []

//a function to convert csv to json
const convert = () => {
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        const jsonContent = JSON.stringify(jsonObj)

        fs.writeFile(csvFilePath.slice(0, -3)+'json', jsonContent, 'utf-8', async (err) => {
            if (err) {
                console.log(err)
            }
            const jsonFile = require(csvFilePath.slice(0, -3)+'json')
            for (let x of jsonFile) {
                const hashSum = await crypto.createHash('sha256') // calculate the sha256 of json
                await hashSum.update(JSON.stringify(x))
                const hex = await hashSum.digest('hex')
                x['HASH'] = await hex
                hashedJson.push(x) // push calculated hash into an array
            }
        })
    })
}

convert()


// a short delay function to enable total hash calculation
// convert the json array with hash back into an output csv file
setTimeout(() => {
    converter.json2csv(hashedJson, (err, csv) => {
        if(err) throw err
        fs.writeFile(csvFilePath.slice(0, -3)+'output.csv', csv, 'utf-8', (err) => {
            if (err) throw err
        })
    })
}, 500)

