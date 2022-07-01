interval = 1000; //5 * 60 * 1000;

function fetchMysoreData() {
    $.ajax({
        url: "https://api.covid19india.org/state_district_wise.json",
        type: "GET",
        success: function(res) {
            $("#mysore").text(
                res["Karnataka"]["districtData"]["Mysuru"]["confirmed"]);
            $("#bangalore").text(
                res["Karnataka"]["districtData"]["Bengaluru"]["confirmed"]);
            $("#bagalkote").text(
                res["Karnataka"]["districtData"]["Bagalkote"]["confirmed"]);
            $("#belagavi").text(
                res["Karnataka"]["districtData"]["Belagavi"]["confirmed"]);
            $("#thane").text(
                res["Maharashtra"]["districtData"]["Thane"]["confirmed"]);
            $("#coimbatore").text(
                res["Tamil Nadu"]["districtData"]["Coimbatore"]["confirmed"]);
            $("#madurai").text(
                res["Tamil Nadu"]["districtData"]["Madurai"]["confirmed"]);
            $("#chennai").text(
                res["Tamil Nadu"]["districtData"]["Chennai"]["confirmed"]);
            $("#tirunelveli").text(
                res["Tamil Nadu"]["districtData"]["Tirunelveli"]["confirmed"]);
        }
    });
}

fetchMysoreData();

function fetchWorcesterData() {
    $.ajax({
        url: "https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&country_code=US&timelines=false",
        type: "GET",
        success: function(res) {
            var data = res["locations"];
            for (let i = 0; i < data.length; i++) {
                if (
                    data[i]["county"] == "Worcester" &&
                    data[i]["province"] == "Massachusetts"
                ) {
                    $("#worcester").text(data[i]["latest"]["confirmed"]);
                    break;
                }
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

fetchWorcesterData();

var sc_project = 12228730;
var sc_invisible = 1;
var sc_security = "bac17ab4";
var scJsHost = "https://";
document.write("<sc" + "ript type='text/javascript' src='" +
    scJsHost +
    "statcounter.com/counter/counter.js'></" + "script>");




function generateGradient(factor, relComp, countryName) {
    // let obj = relComp[countryName]
    // let rel = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b)
    // if(rel=="Christians")
    //   return "darkblue"
    // else if(rel=="Muslims")
    //   return "darkgreen"
    // else if(rel=="Hindus")
    //   return "orange"
    // else if(rel=="Buddhists")
    //   return "#F8C602"
    // else
    return "grey"
}


function updateRelComp(relComp, covidData, i, medianAge, factor, origFactor) {
    let countryName = covidData.data[i].name.trim();
    return {
        population: covidData.data[i].population,
        country: covidData.data[i].name.trim(),
        medianAge: medianAge[countryName],
        deaths: covidData.data[i].latest_data["deaths"],
        confirmed: covidData.data[i].latest_data["confirmed"],
        recovered: covidData.data[i].latest_data["recovered"],
        factor: factor,
        religion: {
            "Christian": relComp[countryName]['Christians'],
            "Hindus": relComp[countryName]['Hindus'],
            "Muslims": relComp[countryName]['Muslims'],
            "Buddhists": relComp[countryName]['Buddhists']
        }
    };
}

var ctx = document.getElementById("recoveryFactorChart").getContext("2d");
var medianAge;
$.getJSON(
    "https://raw.githubusercontent.com/kingspp/covid19_research/master/covid19/data/medianAgeDashboard.json",
    function(medianAge) {
        var chance_of_recovery = {};
        $.getJSON(
            "https://raw.githubusercontent.com/kingspp/covid19_research/master/covid19/data/country_religion_composition.json",
            function(relComp) {
                $.getJSON("https://corona-api.com/countries", function(covidData) {
                    for (let i = 0; i < covidData.data.length; i++) {
                        if (
                            medianAge[covidData.data[i].name.trim()] != undefined &&
                            covidData.data[i].latest_data["deaths"] != 0 &&
                            covidData.data[i].latest_data["recovered"] != 0 &&
                            relComp[covidData.data[i].name.trim()] != undefined
                        ) {
                            let countryName = covidData.data[i].name.trim()
                            let factor =
                                Math.round(((covidData.data[i].latest_data["recovered"] + 1e-5) /
                                        (covidData.data[i].latest_data["deaths"] + 1e-5)) *
                                    (1 / (medianAge[countryName] / 100)) * 100) / 100;
                            chance_of_recovery[countryName] = updateRelComp(relComp, covidData, i, medianAge, factor);
                        }
                    }
                    chance_of_recovery = _.orderBy(chance_of_recovery, ["factor"], ["desc"]);
                    var gradients = [];
                    _.each(chance_of_recovery, function(val) {
                        gradients.push(generateGradient(val['factor'], relComp, val['country']))
                    })

                    var myChart = new Chart(ctx, {
                        type: "horizontalBar",
                        data: {
                            labels: _.map(chance_of_recovery, "country"),
                            datasets: [{
                                label: "Recovery Factor",
                                data: _.map(chance_of_recovery, "factor"),
                                borderWidth: 1,
                                backgroundColor: gradients
                            }]
                        },
                        options: {
                            legend: { display: false },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    type: "logarithmic"
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            },
                            tooltips: {
                                enabled: true,
                                mode: "single",
                                callbacks: {
                                    footer: function(tooltipItems, data) {
                                        return (
                                            "Rank: " +
                                            (tooltipItems[0].index + 1) +
                                            "\nConfirmed: " +
                                            chance_of_recovery[tooltipItems[0].index].confirmed +
                                            "\nRecovered: " +
                                            chance_of_recovery[tooltipItems[0].index].recovered +
                                            "\nDeaths: " +
                                            chance_of_recovery[tooltipItems[0].index].deaths +
                                            "\nMedian Age: " +
                                            chance_of_recovery[tooltipItems[0].index].medianAge +
                                            "\nPopulation: " +
                                            chance_of_recovery[tooltipItems[0].index].population // +
                                            // "\nReligion:\n   Christianity: "+ chance_of_recovery[tooltipItems[0].index].religion["Christian"]+"%"+
                                            // "\n   Islam: "+ chance_of_recovery[tooltipItems[0].index].religion["Muslims"]+"%"+
                                            // "\n   Hinduism: "+ chance_of_recovery[tooltipItems[0].index].religion["Hindus"]+"%"+
                                            // "\n   Buddhism: "+ chance_of_recovery[tooltipItems[0].index].religion["Buddhists"]+"%"
                                        );
                                    }
                                }
                            }
                        }
                    });
                });
            });

    }
);




setInterval(fetchMysoreData, interval);
setInterval(fetchWorcesterData, interval);