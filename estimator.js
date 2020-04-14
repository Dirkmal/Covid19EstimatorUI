function calcCurrInfected(reportedCases, multFactor) {
    return reportedCases * multFactor;
}
  
function estNewInfections(currInfected, days) {
    const factor = Math.trunc(days / 3);
  
    return Math.trunc(currInfected * (2 ** factor));
}
  
function severeCases(infections) {
    return Math.trunc(infections * 0.15);
}
  
function availableBeds(totalBeds, numberOfCases) {
    return Math.trunc((totalBeds * 0.35) - numberOfCases);
}
  
function ICUCases(infections) {
    return Math.trunc(infections * 0.05);
}
  
function ventilatorCases(infections) {
    return Math.trunc(infections * 0.02);
}
  
function economicLoss(infections, population, income, period) {
    return Math.trunc(
      (infections * population * income) / period
    );
}
  
function periodInDays(durationType, period) {
    let actualDays = period;
    if (durationType === 'weeks') {
      actualDays = period * 7;
    } else if (durationType === 'months') {
      actualDays = period * 30;
    }
  
    return actualDays;
}
  
const covid19ImpactEstimator = (data) => {
    const actualDays = periodInDays(data.periodType, data.timeToElapse);
  
    // challenge 1
    const currInfected = calcCurrInfected(data.reportedCases, 10);
    const sevCurrInfected = calcCurrInfected(data.reportedCases, 50);
  
    const newInfections = estNewInfections(currInfected, actualDays);
    const sevNewInfections = estNewInfections(sevCurrInfected, actualDays);
  
    // challenge 2
    const impactSevCases = severeCases(newInfections);
    const sevCases = severeCases(sevNewInfections);
  
    // challenge 2.5
    const dollarsLost = economicLoss(newInfections,
        data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, actualDays);
    const sevDollarsLost = economicLoss(sevNewInfections,
        data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, actualDays);
  
    return {
        data,
        impact: {
            currentlyInfected: currInfected,
            infectionsByRequestedTime: newInfections,
            severeCasesByRequestedTime: severeCases(newInfections),
            hospitalBedsByRequestedTime: availableBeds(data.totalHospitalBeds, impactSevCases),
            casesForICUByRequestedTime: ICUCases(newInfections),
            casesForVentilatorsByRequestedTime: ventilatorCases(newInfections),
            dollarsInFlight: dollarsLost
        },
        severeImpact: {
            currentlyInfected: sevCurrInfected,
            infectionsByRequestedTime: sevNewInfections,
            severeCasesByRequestedTime: severeCases(sevNewInfections),
            hospitalBedsByRequestedTime: availableBeds(data.totalHospitalBeds, sevCases),
            casesForICUByRequestedTime: ICUCases(sevNewInfections),
            casesForVentilatorsByRequestedTime: ventilatorCases(sevNewInfections),
            dollarsInFlight: sevDollarsLost
        }
    };
};
  
// export default covid19ImpactEstimator;
  