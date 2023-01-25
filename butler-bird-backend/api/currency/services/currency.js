'use strict';

const axios = require('axios');
const {get} = require('lodash');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function fetchExchangeRates() {
  const {data} = await axios.get(`https://api.exchangerate.host/latest`);
  const exchangeRates = get(strapi, 'localization.exchangeRates', {});
  exchangeRates.refreshedAt = new Date();
  exchangeRates.rawData = data;
  get(strapi, 'localization.currencies', []).forEach(currency => {
    exchangeRates[currency.iso] = calculateRates(data, currency);
  });
  strapi.localization.exchangeRates = exchangeRates;
}

function calculateRates(data, currency) {
  const {rates} = data;
  const currencies = get(strapi, 'localization.currencies', []);
  const calculatedRates = {};
  const factor = rates[currency.iso] || 1;
  currencies.forEach(it => {
    calculatedRates[it.iso] = rates[it.iso] / factor;
  });
  return calculatedRates;
}

function mockExchangeRates() {
  let mockRates = {};
  strapi.localization.currencies.forEach(currency => {
    let rates = {};
    strapi.localization.currencies.forEach(it => rates[it.iso] = 1);
    mockRates[currency.iso] = rates;
  });
  return mockRates;
}

async function inject() {
  strapi.localization.currencies = await strapi.services.currency.find();
  strapi.localization.exchangeRates = {};
  await fetchExchangeRates();
}

async function calculateExchangeRates(currency) {
  const base = currency.iso;
  const other = strapi.localization.currencies.filter(it => it.id !== currency.id).map(it => it.iso);
  const {data} = await axios.get(`https://api.ratesapi.io/api/latest?base=${base}&symbols=${other.join(',')}`);
  strapi.localization.exchangeRates[base] = data.rates;
}

async function refreshExchangeRates() {
  if (true || process.env.DEV_MODE === 'TRUE') {
    strapi.localization.exchangeRates = mockExchangeRates(strapi.localization.currencies);
  } else {
    await Promise.all(strapi.localization.currencies.map(it => calculateExchangeRates(it)));
  }
}

async function getExchangeRates(iso) {
  return strapi.localization.exchangeRates[iso];
}

module.exports = {
  inject,
  calculateExchangeRates,
  fetchExchangeRates,
  getExchangeRates,
};
