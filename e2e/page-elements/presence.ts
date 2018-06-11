export interface Presence {
  /**
   * Promise resolves if the element is fully loaded (without children)
   */
  awaitPresence(): Promise<void>;

  /**
   * Promise resolves if the element is fully loaded (with children)
   */
  awaitFullPresence(): Promise<void>;
}
