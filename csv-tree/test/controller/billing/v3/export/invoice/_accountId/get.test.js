const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const chai = require('chai');
const config = require('../../../../../../../application.json');
const exportInvoiceDetails = require('../../../../../../../src/controller/invoice/exportInvoiceDetails');

chai.should();

const dirtyChai = require('dirty-chai');

const sandbox = sinon.sandbox.create();
chai.use(sinonChai);
chai.use(dirtyChai);

const value = '\ncustomerAddress\n,companyName,,\tJB Finance Pvt Limited2\n,addressLine1,,\t150 Lonsdale\n,stateAndPostalCode,,\tVIC 3000\n,city,,\tMELBOURNE\n\npaymentSummary\n,balanceCarriedForward\n,totalDue,,\t3602\n,paymentsReceivedLastPeriod\n,dueDate,,\t28 Nov 18\n,newCharges,,\t3602\n\nserviceSummary\n\n,accountLevelChargesAndCredits\n,,grossTotalBill,,\t3602\n,,amountOfGstIncludedInGrossTotalBill,,\t327\n,,gstFreeItemsIncludedInNewCharges\n,,gstIncludedInNewCharges,,\t327\n,,gstIncludedInAdjustments\n,,adjustmentsExcludingGst\n,,adjustmentsIncludingGst\n,,totalNewChargesInBill,,\t3602\n,,,sites\n\n,,,physicalLocationName,,\t150 lonsdale street\n,,,siteCostExcludingGst,,\t3274\n,,,siteCostIncludingGst,,\t3602\n,,,offerName,,\tConnected Workplace\n\n,servicesAndCharges\n\n,,outOfPlanCharges\n\n,,,,,serviceType,,\tFixed Seat (Zone 3)-01 Nov to 30 Nov\n,,,,,quantity,,\t1\n,,,,,costExcludingGst,,\t200\n,,,,,costIncludingGst,,\t220\n\n,,onceOffCharges\n\n,,,,,serviceType,,\tPolycom VVX 411-undefined to undefined\n,,,,,quantity,,\t1\n,,,,,costExcludingGst,,\t600\n,,,,,costIncludingGst,,\t660\n\ninvoiceSummary\n,issueDate,,\t29 Oct 18\n,period,,\t01 Oct 18 - 29 Oct 18\n,accountId,,\t200034767920\n,invoiceNumber,,\t9900000001164\n';
describe('get', () => {
  let exportInvoiceDetailsStub;
  let send;
  let header;
  let requestStub;
  let getApi;

  beforeEach(() => {
    exportInvoiceDetailsStub = sandbox.stub(exportInvoiceDetails, 'exportInvoiceDetails');
    send = sandbox.spy();
    header = sandbox.spy();
    requestStub = {};
    getApi = proxyquire('../../../../../../../src/controller/billing/v3/export/invoice/_accountId/get', {
      '../../../../../invoice/exportInvoiceDetails': exportInvoiceDetailsStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('success', async () => {
    const request = Object.assign(requestStub, { args: { accountId: '700000000104', invoiceNumber: '9900000003349' } });
    exportInvoiceDetailsStub.resolves(value);
    getApi.init(config);
    await getApi.handler(request, { header, send });
    send.should.have.been.calledOnce;
    send.args[0]['1'].should.be.equal(200);
  });
});

describe('get', () => {
  let exportInvoiceDetailsStub;
  let sendJson;
  let requestStub;
  let getApi;

  beforeEach(() => {
    exportInvoiceDetailsStub = sandbox.stub(exportInvoiceDetails, 'exportInvoiceDetails');
    sendJson = sandbox.spy();
    requestStub = {

    };
    getApi = proxyquire('../../../../../../../src/controller/billing/v3/export/invoice/_accountId/get', {
      '../../../../../invoice/exportInvoiceDetails': exportInvoiceDetailsStub,

    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('account export invoices returns error', async () => {
    const request = Object.assign(requestStub, { args: { account: '700000000104' } });
    const error = new Error('Address not found');
    exportInvoiceDetailsStub.rejects(error);
    getApi.init(config);
    await getApi.handler(request, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });

  it('account export invoices returns error for unexpected scenario', async () => {
    getApi.init(config);
    getApi.handler(null, { sendJson });
    sendJson.should.have.been.calledOnce;
    sendJson.args[0]['1'].should.be.equal('500');
  });
});
