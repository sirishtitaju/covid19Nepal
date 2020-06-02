module.exports = (temp, cases) => {
    // let fullDate = cases.Date;
    // fullDate = fullDate.substr(0, 10); //Only first 10 Characters

    let output = temp;
    // output = output.replace(/{%Country%}/g, cases.Country);
    output = output.replace(/{%Date%}/g, cases.date);
    output = output.replace(/{%Confirmed%}/g, cases.totalCases);
    output = output.replace(/{%Recovered%}/g, cases.totalRecoveries);
    output = output.replace(/{%Deaths%}/g, cases.totalDeaths);
    return output;
};