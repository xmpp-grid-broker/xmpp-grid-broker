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

  public begin() {
    this.processing = true;
  }

  public done(params: { successMessage?: string, errorMessage?: string } = {}) {
    this.success = params.successMessage;
    this.error = params.errorMessage;
    this.processing = false;
  }

}
