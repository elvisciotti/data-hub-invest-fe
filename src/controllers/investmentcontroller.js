/**
 * Created by jimsmith on 24/01/2017.
 */

const express = require('express')
const winston = require('winston')
const companyRepository = require('../repositorys/companyrepository')


const controllerUtils = require('../lib/controllerutils')

// imported from company controller
// @todo merge into utils
const investmentDetailLabels = {
  account_management_tier: 'Account management tier',
  account_manager: 'Account manager',
  ownership: 'Ownership'
}

const investmentDetailsDisplayOrder = Object.keys(investmentDetailLabels)

function getInvestmentDetailsDisplay (company) {
  if (!company.id) return null
  return {
    account_management_tier: 'B - Top 300',
    account_manager: `<a href="/advisor/${company.account_manager.id}/">${company.account_manager.name}</a>`,
    ownership: 'United States of America'
  }
}

const router = express.Router()

function index(req, res) {

  const id = req.params.sourceId

  companyRepository.getCompany(req.session.token, id, null).then((company) => {

    let investmentDisplay = getInvestmentDetailsDisplay(company)

    res.render('investment/index', {investmentDisplay, investmentDetailLabels, investmentDetailsDisplayOrder})

  }).catch((error) => {
    const errors = error.error
    if (error.response) {
      return res.status(error.response.statusCode).json({errors})
    }
    next(error)})


}

router.get('/investment/', index)
router.get('/investment/:sourceId', index)

module.exports = { router }
