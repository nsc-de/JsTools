/**
 * Create a savepromise instance
 * @param fn the function to call when saving
 * @returns a savepromise instance
 */
export default function SavePromise(
  fn: () => Promise<unknown | void> | void | unknown,
): {
  /**
   * True when a save is in progress
   */
  readonly saving: boolean;

  /**
   * True when a save is scheduled
   */
  readonly scheduled: boolean;

  /**
   * A promise that will be resolved when the scheduled save is complete
   */
  readonly promise: Promise<unknown> | undefined;

  /**
   * Save the data
   * @returns A promise that will be resolved when the save is complete
   */
  save: () => Promise<unknown>;
};

/**
 * A savepromise instance
 */
export type SavePromise = ReturnType<typeof SavePromise>;
export { SavePromise };
