export class FormProcessingStatus {
  /**
   * Indicates weather the form is being processed / loaded
   */
  processing = true;

  /**
   * Success message.
   */
  success: string;

  /**
   * Success message.
   */
  error: string;

  constructor(processing: boolean) {
    this.processing = processing;
  }

  public begin() {
    this.processing = true;
  }

  public done(params: { successMessage?: string, errorMessage?: string, error?: any } = {}) {
    this.success = params.successMessage;
    this.error = params.errorMessage;
    if (params.error) {
      console.log(params.error);
    }
    this.processing = false;
  }

}
