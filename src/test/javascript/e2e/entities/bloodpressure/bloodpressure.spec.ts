/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BloodpressureComponentsPage, BloodpressureDeleteDialog, BloodpressureUpdatePage } from './bloodpressure.page-object';

const expect = chai.expect;

describe('Bloodpressure e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bloodpressureUpdatePage: BloodpressureUpdatePage;
  let bloodpressureComponentsPage: BloodpressureComponentsPage;
  let bloodpressureDeleteDialog: BloodpressureDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Bloodpressures', async () => {
    await navBarPage.goToEntity('bloodpressure');
    bloodpressureComponentsPage = new BloodpressureComponentsPage();
    await browser.wait(ec.visibilityOf(bloodpressureComponentsPage.title), 5000);
    expect(await bloodpressureComponentsPage.getTitle()).to.eq('twentyOnePointsApp.bloodpressure.home.title');
  });

  it('should load create Bloodpressure page', async () => {
    await bloodpressureComponentsPage.clickOnCreateButton();
    bloodpressureUpdatePage = new BloodpressureUpdatePage();
    expect(await bloodpressureUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.bloodpressure.home.createOrEditLabel');
    await bloodpressureUpdatePage.cancel();
  });

  it('should create and save Bloodpressures', async () => {
    const nbButtonsBeforeCreate = await bloodpressureComponentsPage.countDeleteButtons();

    await bloodpressureComponentsPage.clickOnCreateButton();
    await promise.all([
      bloodpressureUpdatePage.setSystolicInput('5'),
      bloodpressureUpdatePage.setDiastolicInput('5'),
      bloodpressureUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      bloodpressureUpdatePage.userSelectLastOption()
    ]);
    expect(await bloodpressureUpdatePage.getSystolicInput()).to.eq('5', 'Expected systolic value to be equals to 5');
    expect(await bloodpressureUpdatePage.getDiastolicInput()).to.eq('5', 'Expected diastolic value to be equals to 5');
    expect(await bloodpressureUpdatePage.getTimestampInput()).to.contain(
      '2001-01-01T02:30',
      'Expected timestamp value to be equals to 2000-12-31'
    );
    await bloodpressureUpdatePage.save();
    expect(await bloodpressureUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bloodpressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Bloodpressure', async () => {
    const nbButtonsBeforeDelete = await bloodpressureComponentsPage.countDeleteButtons();
    await bloodpressureComponentsPage.clickOnLastDeleteButton();

    bloodpressureDeleteDialog = new BloodpressureDeleteDialog();
    expect(await bloodpressureDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.bloodpressure.delete.question');
    await bloodpressureDeleteDialog.clickOnConfirmButton();

    expect(await bloodpressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
