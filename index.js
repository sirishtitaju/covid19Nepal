const fs = require("fs");
const superagent = require("superagent");

const http = require("http");
const url = require("url");

const replaceTemplate = require("./dev-data/module");

const selCountry = fs.readFileSync("./dev-data/country.txt", "utf-8");
const tempHtml = fs.readFileSync("./template-index.html", "utf-8");
console.log(selCountry);

const tempCard = fs.readFileSync("./template-column.html", "utf-8");
// console.log(selCountry);

// const api_url = `https://api.covid19api.com/dayone/country/${selCountry}`;
const api_url = `https://data.nepalcorona.info/api/v1/covid/timeline`;
const api_summary = `https://data.nepalcorona.info/api/v1/covid/summary`;
const api_news = `https://nepalcorona.info/api/v1/news`;

const readFilePro = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) return reject(`Could Not Write File : ${err}`);
            resolve(data);
        });
    });
};


const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) return reject(`Could Not Write File : ${err}`);
            resolve('Success Written File');
        });
    });
};

const server = http.createServer((req, res) => {
    const reqUrl = req.url;
    const {
        query,
        pathname
    } = url.parse(reqUrl, true);

    // Overview Page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {
            "Content-type": "text/html",
        });

        //////////////////////////////// First API
        const res2pro = superagent.get(api_url).end((err, data) => {
            if (err) return console.log(err);
            let dataObj = data.body;

            writeFilePro("timeline.json", JSON.stringify(dataObj));

            dataObj = dataObj.reverse();
            dataObj.shift();
            // const date = arrObj.map((el) => replaceTemplates(tempColumn, el));

            const card = dataObj.map((el) => replaceTemplate(tempCard, el)).join(" ");
            let output = tempHtml.replace("{%Columns%}", card);

            /////Increase in active
            let confArr = dataObj.map((el) => el.totalCases);
            var newConf = [];
            for (var i = 0; i < confArr.length - 1; i++) {
                newConf.push(confArr[i] - confArr[i + 1]);
            }
            var newArr = [...newConf];

            newArr.map((el) => {
                if (el !== 0) return (output = output.replace("{%NewConfirmed%}", el));
                else return (output = output.replace("{%NewConfirmed%}", ""));
            });

            //// Increase in Recover
            let incRecovered = dataObj.map((el) => el.totalRecoveries);

            var newConf = [];
            for (var i = 0; i < incRecovered.length - 1; i++) {
                newConf.push(incRecovered[i] - incRecovered[i + 1]);
            }
            var newArr = [...newConf];

            newArr.map((el) => {
                if (el !== 0) return (output = output.replace("{%NewRecovered%}", el));
                else return (output = output.replace("{%NewRecovered%}", ""));
            });

            //// Increase in Deaths
            let incDeath = dataObj.map((el) => el.totalDeaths);

            var newConf = [];
            for (var i = 0; i < incDeath.length - 1; i++) {
                newConf.push(incDeath[i] - incDeath[i + 1]);
            }
            var newArr = [...newConf];

            newArr.map((el) => {
                if (el !== 0) return (output = output.replace("{%NewDeaths%}", el));
                else return (output = output.replace("{%NewDeaths%}", ""));
            });

            for (let i = 0; i < dataObj.length - 1; i++) {
                output = output.replace("{%confBadge%}", "badge");
                output = output.replace("{%badge-danger%}", "badge-danger");
                output = output.replace("{%recBadge%}", "badge");
                output = output.replace("{%badge-success%}", "badge-primary");
                output = output.replace("{%deatBadge%}", "badge");
                output = output.replace("{%badge-danger%}", "badge-danger");
            }

            for (let i = dataObj.length - 2; i < dataObj.length - 1; i++) {
                output = output.replace("{%displayNone%}", "none");
                output = output.replace("{%NewConfirmed%}", "");
                output = output.replace("{%NewRecovered%}", "");
                output = output.replace("{%NewDeaths%}", "");
            }


            const summary = fs.readFileSync(`${__dirname}/summary-nepal.json`, 'utf-8');
            // console.log(summary);

            const summObj = JSON.parse(summary);
            const genderSumm = summObj.gender;
            const typeSumm = summObj.type;
            const ageSumm = summObj.age_group;
            const proSumm = summObj.province;

            const genderArr = genderSumm.cases;
            const typeArr = typeSumm.cases;
            const ageArr = ageSumm.cases;
            const proArr = proSumm.cases;



            let maleCount;
            let femaleCount;
            let agenderCount;

            let localCount;
            let nulltypeCount;
            let importCount;

            let CCount;
            let ACount;
            let MCount;
            let MMCount;
            let MMMCount;
            let OCount;
            let OOCount;
            let UACount;

            let p1Count;
            let p2Count;
            let p3Count;
            let p4Count;
            let p5Count;
            let p6Count;
            let p7Count;

            genderArr.map((el) => {
                if (el.gender === 'male') {

                    maleCount = el.count;
                }
                if (el.gender === 'female') {

                    femaleCount = el.count;
                }
                if (el.gender === null) {

                    agenderCount = el.count;
                }
            });

            typeArr.map((el) => {
                if (el.type === 'imported') {

                    importCount = el.count;
                }
                if (el.type === 'local_transmission') {
                    localCount = el.count;
                }
                if (el.type === null) {
                    nulltypeCount = el.count;
                }
            });

            ageArr.map((el) => {
                if (el.age === '0 - 17') {
                    CCount = el.count;
                }
                if (el.age === '18 - 29') {
                    ACount = el.count;
                }
                if (el.age === '30 - 39') {
                    MCount = el.count;
                }
                if (el.age === '40 - 49') {
                    MMCount = el.count;
                }
                if (el.age === '50 - 59') {
                    MMMCount = el.count;
                }
                if (el.age === '60 - 70') {
                    OCount = el.count;
                }
                if (el.age === '70+') {
                    OOCount = el.count;
                }
                if (el.age === 'Unknown') {
                    UACount = el.count;
                }
            });


            proArr.map((el) => {
                if (el.province === 1) {
                    p1Count = el.count;
                }
                if (el.province === 2) {
                    p2Count = el.count;
                }
                if (el.province === 3) {
                    p3Count = el.count;
                }
                if (el.province === 4) {
                    p4Count = el.count;
                }
                if (el.province === 5) {
                    p5Count = el.count;
                }
                if (el.province === 6) {
                    p6Count = el.count;
                }
                if (el.province === 7) {
                    p7Count = el.count;
                }
            });


            let totalCount = (maleCount + femaleCount + agenderCount);
            console.log(OCount);


            output = output.replace(/{%Total%}/g, maleCount + femaleCount + agenderCount);


            output = output.replace("{%Male%}", (((maleCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Female%}", (((femaleCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Agender%}", (((agenderCount) / totalCount) * 100).toFixed(2));

            output = output.replace("{%Total_Male%}", maleCount);
            output = output.replace("{%Total_Female%}", femaleCount);
            output = output.replace("{%Total_Agender%}", agenderCount);

            output = output.replace("{%Imported%}", (((importCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Local%}", (((localCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Unknown%}", (((nulltypeCount) / totalCount) * 100).toFixed(2));

            output = output.replace("{%Imported_Total%}", importCount);
            output = output.replace("{%Local_Total%}", localCount);
            output = output.replace("{%Unknown_Total%}", nulltypeCount);

            output = output.replace("{%Child%}", (((CCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Adult%}", (((ACount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Madult%}", (((MCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%MMadult%}", (((MMCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%MMMadult%}", (((MMMCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Old%}", (((OCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%OOld%}", (((OOCount) / totalCount) * 100).toFixed(2));
            output = output.replace("{%Unknown_Age%}", (((UACount) / totalCount) * 100).toFixed(2));

            output = output.replace("{%Child_Total%}", CCount);
            output = output.replace("{%Adult_Total%}", ACount);
            output = output.replace("{%Madult_Total%}", MCount);
            output = output.replace("{%MMadult_Total%}", MMCount);
            output = output.replace("{%MMMadult_Total%}", MMMCount);
            output = output.replace("{%Old_Total%}", OCount);
            output = output.replace("{%OOld_Total%}", OOCount);
            output = output.replace("{%Unknown_Age_Total%}", UACount);



            output = output.replace("{%p1%}", (((p1Count) / totalCount) * 100).toFixed(2));
            output = output.replace("{%p2%}", (((p2Count) / totalCount) * 100).toFixed(2));
            output = output.replace("{%p3%}", (((p3Count) / totalCount) * 100).toFixed(2));
            output = output.replace("{%p4%}", (((p4Count) / totalCount) * 100).toFixed(2));
            output = output.replace("{%p5%}", (((p5Count) / totalCount) * 100).toFixed(2));
            output = output.replace("{%p6%}", (((p6Count) / totalCount) * 100).toFixed(2));
            output = output.replace("{%p7%}", (((p7Count) / totalCount) * 100).toFixed(2));

            output = output.replace("{%p1_Total%}", p1Count);
            output = output.replace("{%p2_Total%}", p2Count);
            output = output.replace("{%p3_Total%}", p3Count);
            output = output.replace("{%p4_Total%}", p4Count);
            output = output.replace("{%p5_Total%}", p5Count);
            output = output.replace("{%p6_Total%}", p6Count);
            output = output.replace("{%p7_Total%}", p7Count);


            res.end(output);
            // console.log(
            //     `\n--------------------------------------------------------------------- Output1:\n ${output}`
            // );
        });

        const res1pro = superagent.get(api_summary).end((err, data) => {
            if (err) return console.log(err);
            let dataObj = data.body;

            writeFilePro("summary-nepal.json", JSON.stringify(dataObj));
        });

        const res3pro = superagent.get(api_news).end((err, data) => {
            if (err) return console.log(err);
            let dataObj = data.body;

            writeFilePro("news.json", JSON.stringify(dataObj));
        });

    } //Overivew | /
    //NOT FOUND
    else {
        res.writeHead(404, {
            "Content-type": "text/html",
            "my-own-header": "hello-world",
        });
        res.end("<h1>Page Not Found</h1>");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to requests on port 8000");
});