const fs = require("fs");
const request = require("request");
const express = require("express");
const app = express();

const replaceTemplate = require("./dev-data/module");

const tempHtml = fs.readFileSync("./template-index.html", "utf-8");
const tempCard = fs.readFileSync("./template-column.html", "utf-8");
const tempNewsCard = fs.readFileSync("./template-newsCard.html", "utf-8");
const tempFaqsCard = fs.readFileSync("./template-faqsCard.html", "utf-8");
const tempSearchCard = fs.readFileSync("./template-search.html", "utf-8");
// console.log(selCountry);
// const api_url = `https://api.covid19api.com/dayone/country/${selCountry}`;
//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
function apiCall(reqOps) {
  return new Promise((resolve, reject) => {
    request(reqOps, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        resolve(JSON.parse(body));
      }
      reject(err);
    });
  });
}

var overall = {
  url: "https://nepalcorona.info/api/v1/data/nepal",
};


var timeline = {
  url: "https://data.nepalcorona.info/api/v1/covid/timeline",
};

var summary_np = {
  url: "https://data.nepalcorona.info/api/v1/covid/summary",
};

var faqs = {
  url: "https://nepalcorona.info/api/v1/faqs",
};
var news = {
  url: "https://nepalcorona.info/api/v1/news",
};

var districts = {
  url: "https://data.nepalcorona.info/api/v1/districts",
};
var municipals = {
  url: "https://data.nepalcorona.info/api/v1/municipals/",
};

const server = app.get("/", async function (req, res) {
  try {
    let data_overall = await apiCall(overall);
    let data_summary = await apiCall(summary_np);
    let data_faqs = await apiCall(faqs);
    let data_timeline = await apiCall(timeline);
    let data_news = await apiCall(news);
    let data_districts = await apiCall(districts);
    let data_municipals = await apiCall(municipals);
    data_timeline.reverse();
    data_timeline.shift();
    var todayCase = data_timeline.shift();


    todayCase.totalCases = data_overall.tested_positive - 1;
    todayCase.totalRecoveries = data_overall.recovered;
    todayCase.totalDeaths = data_overall.deaths;

    data_timeline.unshift(todayCase);



    data_timeline = data_timeline.slice(0, 51); ///////////////////////////////////////////// Slice
    const card = data_timeline
      .map((el) => replaceTemplate(tempCard, el))
      .join(" ");
    let output = tempHtml.replace("{%Columns%}", card);

    ///Increase in active
    let confArr = data_timeline.map((el) => el.totalCases);
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
    let incRecovered = data_timeline.map((el) => el.totalRecoveries);

    var newConf = [];
    for (var i = 0; i < incRecovered.length - 1; i++) {
      newConf.push(incRecovered[i] - incRecovered[i + 1]);
    }
    var newArr = [...newConf];

    newArr = newArr.slice(0, 51); ///////////////////////////////////////////// Slice
    newArr.map((el) => {
      if (el !== 0) return (output = output.replace("{%NewRecovered%}", el));
      else return (output = output.replace("{%NewRecovered%}", ""));
    });

    //// Increase in Deaths
    let incDeath = data_timeline.map((el) => el.totalDeaths);

    var newConf = [];
    for (var i = 0; i < incDeath.length - 1; i++) {
      newConf.push(incDeath[i] - incDeath[i + 1]);
    }
    var newArr = [...newConf];

    newArr.map((el) => {
      if (el !== 0) return (output = output.replace("{%NewDeaths%}", el));
      else return (output = output.replace("{%NewDeaths%}", ""));
    });

    for (let i = 0; i < data_timeline.length - 1; i++) {
      output = output.replace("{%confBadge%}", "badge");
      output = output.replace("{%badge-danger%}", "badge-danger");
      output = output.replace("{%recBadge%}", "badge");
      output = output.replace("{%badge-success%}", "badge-primary");
      output = output.replace("{%deatBadge%}", "badge");
      output = output.replace("{%badge-danger%}", "badge-danger");
    }

    for (let i = data_timeline.length - 2; i < data_timeline.length - 1; i++) {
      output = output.replace("{%displayNone%}", "none");
      output = output.replace("{%NewConfirmed%}", "");
      output = output.replace("{%NewRecovered%}", "");
      output = output.replace("{%NewDeaths%}", "");
    }

    /////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////// SUMMARY API

    const genderSumm = data_summary.gender;
    const typeSumm = data_summary.type;
    const ageSumm = data_summary.age_group;
    const proSumm = data_summary.province;

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
      if (el.gender === "male") {
        maleCount = el.count;
      }
      if (el.gender === "Male") {
        maleCount += el.count;
      }
      if (el.gender === "female") {
        femaleCount = el.count;
      }
      if (el.gender === "Female") {
        femaleCount += el.count;
      }
      if (el.gender === null) {
        agenderCount = el.count;
      }
    });

    typeArr.map((el) => {
      if (el.type === "imported") {
        importCount = el.count;
      }
      if (el.type === "local_transmission") {
        localCount = el.count;
      }
      if (el.type === null) {
        nulltypeCount = el.count;
      }
    });

    ageArr.map((el) => {
      if (el.age === "0 - 17") {
        CCount = el.count;
      }
      if (el.age === "18 - 29") {
        ACount = el.count;
      }
      if (el.age === "30 - 39") {
        MCount = el.count;
      }
      if (el.age === "40 - 49") {
        MMCount = el.count;
      }
      if (el.age === "50 - 59") {
        MMMCount = el.count;
      }
      if (el.age === "60 - 70") {
        OCount = el.count;
      }
      if (el.age === "70+") {
        OOCount = el.count;
      }
      if (el.age === "Unknown") {
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

    let totalCount = data_overall.tested_positive;

    output = output.replace(
      /{%Total%}/g,
      totalCount
    );

    output = output.replace(
      "{%Male%}",
      ((maleCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Male_cn%}",
      ((maleCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%Female%}",
      ((femaleCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Female_cn%}",
      ((femaleCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%Agender%}",
      ((agenderCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Agender_cn%}",
      ((agenderCount / totalCount) * 100).toFixed(0)
    );

    output = output.replace("{%Total_Male%}", maleCount);
    output = output.replace("{%Total_Female%}", femaleCount);
    output = output.replace("{%Total_Agender%}", agenderCount);

    output = output.replace(
      "{%Imported%}",
      ((importCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Imported_cn%}",
      ((importCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%Local%}",
      ((localCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Local_cn%}",
      ((localCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%Unknown%}",
      ((nulltypeCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Unknown_cn%}",
      ((nulltypeCount / totalCount) * 100).toFixed(0)
    );

    output = output.replace("{%Imported_Total%}", importCount);
    output = output.replace("{%Local_Total%}", localCount);
    output = output.replace("{%Unknown_Total%}", nulltypeCount);

    output = output.replace(
      "{%Child%}",
      ((CCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Child_cn%}",
      ((CCount / totalCount) * 100).toFixed(0)
    );

    output = output.replace(
      "{%Adult%}",
      ((ACount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Adult_cn%}",
      ((ACount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%Madult%}",
      ((MCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Madult_cn%}",
      ((MCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%MMadult%}",
      ((MMCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%MMadult_cn%}",
      ((MMCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%MMMadult%}",
      ((MMMCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%MMMadult_cn%}",
      ((MMMCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%Old%}",
      ((OCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Old_cn%}",
      ((OCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%OOld%}",
      ((OOCount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%OOld_cn%}",
      ((OOCount / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%Unknown_Age%}",
      ((UACount / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%Unknown_Age_cn%}",
      ((UACount / totalCount) * 100).toFixed(0)
    );

    output = output.replace("{%Child_Total%}", CCount);
    output = output.replace("{%Adult_Total%}", ACount);
    output = output.replace("{%Madult_Total%}", MCount);
    output = output.replace("{%MMadult_Total%}", MMCount);
    output = output.replace("{%MMMadult_Total%}", MMMCount);
    output = output.replace("{%Old_Total%}", OCount);
    output = output.replace("{%OOld_Total%}", OOCount);
    output = output.replace("{%Unknown_Age_Total%}", UACount);

    output = output.replace(
      "{%p1%}",
      ((p1Count / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%p1_cn%}",
      ((p1Count / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%p2%}",
      ((p2Count / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%p2_cn%}",
      ((p2Count / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%p3%}",
      ((p3Count / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%p3_cn%}",
      ((p3Count / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%p4%}",
      ((p4Count / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%p4_cn%}",
      ((p4Count / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%p5%}",
      ((p5Count / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%p5_cn%}",
      ((p5Count / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%p6%}",
      ((p6Count / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%p6_cn%}",
      ((p6Count / totalCount) * 100).toFixed(0)
    );
    output = output.replace(
      "{%p7%}",
      ((p7Count / totalCount) * 100).toFixed(2)
    );
    output = output.replace(
      "{%p7_cn%}",
      ((p7Count / totalCount) * 100).toFixed(0)
    );

    output = output.replace("{%p1_Total%}", p1Count);
    output = output.replace("{%p2_Total%}", p2Count);
    output = output.replace("{%p3_Total%}", p3Count);
    output = output.replace("{%p4_Total%}", p4Count);
    output = output.replace("{%p5_Total%}", p5Count);
    output = output.replace("{%p6_Total%}", p6Count);
    output = output.replace("{%p7_Total%}", p7Count);

    ///////////////////////////////////////////////////////////////
    //////////////////////////////////////// NEWSSSS

    const replaceNews = (temp, news) => {
      let outputNews = temp;
      // outputNews = outputNews.replace(/{%Country%}/g, cases.Country);
      outputNews = outputNews.replace(/{%Link%}/g, news.url);
      outputNews = outputNews.replace(/{%img_url%}/g, news.image_url);
      outputNews = outputNews.replace(/{%news_title%}/g, news.title);
      outputNews = outputNews.replace(/{%news_description%}/g, news.summary);
      outputNews = outputNews.replace(/{%news_source%}/g, news.source);

      return outputNews;
    };


    const newsCard = data_news.data
      .slice(0, 10)
      .map((el) => replaceNews(tempNewsCard, el))
      .join(" ");

    output = output.replace("{%Cards%}", newsCard);



    //////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// Overall
    const tested_tot = data_overall.tested_total;
    output = output.replace(/{%Total_Tested%}/g, tested_tot);

    const tested_pos = data_overall.tested_positive;
    output = output.replace(/{%Total_Tested_Positive%}/g, tested_pos);
    const tested_pos_per = ((tested_pos / tested_tot) * 100).toFixed(2);
    output = output.replace("{%Tested_Positive%}", tested_pos_per);
    const tested_pos_per_cn = ((tested_pos / tested_tot) * 100).toFixed(0);
    output = output.replace("{%Tested_Positive_cn%}", tested_pos_per_cn);

    const recovered = data_overall.recovered;
    output = output.replace("{%Total_Tested_Recovered%}", recovered);
    const recovered_per = ((recovered / tested_pos) * 100).toFixed(2);
    output = output.replace("{%Tested_Recovered%}", recovered_per);
    const recovered_per_cn = ((recovered / tested_pos) * 100).toFixed(0);
    output = output.replace("{%Tested_Recovered_cn%}", recovered_per_cn);


    const deaths = data_overall.deaths;
    output = output.replace("{%Total_Tested_Deaths%}", deaths);
    const deaths_per = ((deaths / tested_pos) * 100).toFixed(2);
    output = output.replace("{%Tested_Deaths%}", deaths_per);
    const deaths_per_cn = ((deaths / tested_pos) * 100).toFixed(0);
    output = output.replace("{%Tested_Deaths_cn%}", deaths_per_cn);


    const in_isolation = data_overall.in_isolation;
    output = output.replace("{%Total_In_Isolation%}", in_isolation);
    const in_quarantined = data_overall.quarantined;
    output = output.replace("{%Total_In_Quarantined%}", in_quarantined);
    const tested_rdt = data_overall.tested_rdt;
    output = output.replace("{%Total_Tested_RDT%}", tested_rdt);



    ///////////////////////////////////////////////
    ////////////////////// FAQss
    const replaceFaqs = (temp, faqs) => {
      let outputfaqs = temp;

      outputfaqs = outputfaqs.replace(/{%faqs_title%}/g, faqs.question_np);
      outputfaqs = outputfaqs.replace(/{%faqs_answer%}/g, faqs.answer_np);


      return outputfaqs;
    };

    const faqsCard = data_faqs.data.slice(0, 9)
      .map((el) => replaceFaqs(tempFaqsCard, el))
      .join(" ");

    output = output.replace("{%faqs_Cards%}", faqsCard);

    ////////////////////////////////////////////////////////
    //////////////// By District
    const district = req.query.district; //district is the name of your input box
    if (district !== undefined) {
      var districtLength = district.length;
      // console.log("District Length : " + districtLength);
    }
    console.log(district);
    let reqDistrict_ID = null;
    let districtNotFound = false;

    data_districts.map((el) => {
      if ((el.code === district || el.title.toLowerCase() === district || el.title_ne === district || el.title_en === district)) {
        console.log("District ID " + el.id);
        reqDistrict_ID = el.id;
      }
    });

    var districtsByID = {
      url: `https://data.nepalcorona.info/api/v1/districts/${reqDistrict_ID}`,
    };

    if (reqDistrict_ID !== null) {

      let data_districtsByID = await apiCall(districtsByID);
      console.log(data_districtsByID.covid_cases.length);

      let title_dis = data_districtsByID.title;

      let casesByDistrict = data_districtsByID.covid_cases;
      let totalCasesByDistrict = data_districtsByID.covid_cases.length;


      let activeCount = 0;
      let recovCount = 0;
      let deathCount = 0;

      let maleCount = 0;
      let femaleCount = 0;

      casesByDistrict.map((el) => {
        if (el.currentState === "active") {
          activeCount++;
        }
        if (el.currentState === "recovered") {
          recovCount++;
        }
        if (el.currentState === "death") {
          deathCount++;
        }
        if (el.gender === "male") {
          maleCount++;
        }
        if (el.gender === "female") {
          femaleCount++;
        }
      });

      let searchDistrict = tempSearchCard;
      searchDistrict = searchDistrict.replace("{%Municipal_Name%}", title_dis);
      searchDistrict = searchDistrict.replace("{%Search-type%}", "District");

      searchDistrict = searchDistrict.replace("{%MTotal_cases%}", totalCasesByDistrict);
      searchDistrict = searchDistrict.replace("{%MActive_Cases%}", activeCount);
      searchDistrict = searchDistrict.replace("{%MRecovered_Cases%}", recovCount);
      searchDistrict = searchDistrict.replace("{%MDeaths_Cases%}", deathCount);

      searchDistrict = searchDistrict.replace("{%MM_Cases%}", maleCount);
      searchDistrict = searchDistrict.replace("{%MF_Cases%}", femaleCount);

      output = output.replace("{%M-Result%}", searchDistrict);
    } else {
      if (district !== undefined) {
        if (districtLength > 0) {
          output = output.replace("{%M-Result%}", `<h4>District <span class="text-danger p-0">${district}</span> Not Found :(</h4>`);
        }
      } else {
        console.log("Nothing Searched in the District");
      }
    }

    //////////////////////////////////////////////////////////////////
    //////////////////// Municipality
    const municipal = req.query.municipal;
    if (municipal !== undefined) {
      var municipalLength = municipal.length;
      // console.log("District Length : " + districtLength);
    }
    // console.log(municipal);
    var reqMunicipal_ID = null;
    var municipalNotFound = false;

    data_municipals.map((el) => {
      if ((el.code === municipal || el.title.toLowerCase() === municipal || el.title_ne === municipal || el.title_en === municipal)) {
        return reqMunicipal_ID = el.id;
      } else if (municipal !== undefined) {
        municipalNotFound = true;
      }
    });

    if (municipalNotFound) {
      console.log("Sorry, I can't Find this Municipality in the List :(");
    }

    var municipalsByID = {
      url: `https://data.nepalcorona.info/api/v1/municipals/${reqMunicipal_ID}`,
    };

    if (reqMunicipal_ID !== null) {

      let data_municipalsByID = await apiCall(municipalsByID);

      let casesByMunicipal = data_municipalsByID.covid_cases;
      let totalCasesByMunicipal = data_municipalsByID.covid_cases.length;

      let title_mun = data_municipalsByID.title;

      let activeCount = 0;
      let recovCount = 0;
      let deathCount = 0;

      let maleCount = 0;
      let femaleCount = 0;

      casesByMunicipal.map((el) => {
        if (el.currentState === "active") {
          activeCount++;
        }
        if (el.currentState === "recovered") {
          recovCount++;
        }
        if (el.currentState === "death") {
          deathCount++;
        }
        if (el.gender === "male") {
          maleCount++;
        }
        if (el.gender === "female") {
          femaleCount++;
        }
      });

      let searchMunicipal = tempSearchCard;
      searchMunicipal = searchMunicipal.replace("{%Municipal_Name%}", title_mun);
      searchMunicipal = searchMunicipal.replace("{%Search-type%}", "Municipality");

      searchMunicipal = searchMunicipal.replace("{%MTotal_cases%}", totalCasesByMunicipal);
      searchMunicipal = searchMunicipal.replace("{%MActive_Cases%}", activeCount);
      searchMunicipal = searchMunicipal.replace("{%MRecovered_Cases%}", recovCount);
      searchMunicipal = searchMunicipal.replace("{%MDeaths_Cases%}", deathCount);

      searchMunicipal = searchMunicipal.replace("{%MM_Cases%}", maleCount);
      searchMunicipal = searchMunicipal.replace("{%MF_Cases%}", femaleCount);

      output = output.replace("{%M-Result%}", searchMunicipal);

      console.log("Data Municipality ------------------------------------------------ : \n" + data_municipalsByID);

    } else {
      if (municipal !== undefined) {
        if (municipalLength > 0) {
          output = output.replace("{%M-Result%}", `<h4>Municipality <span class="text-danger p-0">${municipal}</span> Not Found :(</h4>`);
        }
      } else {
        console.log("Nothing Searched in the Municipality");
        output = output.replace("{%M-Result%}", "");
      }
    }






    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////// End of Response (GET)
    // console.log(output);
    res.end(output);
  } catch (err) {
    console.log("Error occured in one of the API call: ", err);
  }
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log("Listening to requests on port 8000");
});