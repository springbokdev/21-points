import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class WeightComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-weight div table .btn-danger'));
  title = element.all(by.css('jhi-weight div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class WeightUpdatePage {
  pageTitle = element(by.id('jhi-weight-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  weightInput = element(by.id('field_weight'));
  timestampInput = element(by.id('field_timestamp'));
  userSelect = element(by.id('field_user'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setWeightInput(weight) {
    await this.weightInput.sendKeys(weight);
  }

  async getWeightInput() {
    return await this.weightInput.getAttribute('value');
  }

  async setTimestampInput(timestamp) {
    await this.timestampInput.sendKeys(timestamp);
  }

  async getTimestampInput() {
    return await this.timestampInput.getAttribute('value');
  }

  async userSelectLastOption(timeout?: number) {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class WeightDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-weight-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-weight'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
