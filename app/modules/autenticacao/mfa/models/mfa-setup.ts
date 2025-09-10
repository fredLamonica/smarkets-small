export class MfaSetup {

  private _account: string;
  private _manualEntryKey: string;
  private _qrCodeSetupImageUrl: string;

  get account(): string {
    return this._account;
  }

  get manualEntryKey(): string {
    return this._manualEntryKey;
  }

  get qrCodeSetupImageUrl(): string {
    return this._qrCodeSetupImageUrl;
  }

  constructor(mfaSetup: any) {
    this._account = mfaSetup.account;
    this._manualEntryKey = mfaSetup.manualEntryKey;
    this._qrCodeSetupImageUrl = mfaSetup.qrCodeSetupImageUrl;
  }

}
