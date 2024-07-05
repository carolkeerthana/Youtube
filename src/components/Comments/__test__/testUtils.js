// testUtils.js

import { screen, fireEvent } from '@testing-library/react';

/**
 * Opens the dropdown for a comment by its test id.
 *
 * @param {string} testId - The test id of the dropdown icon.
 */
export const openDropdownByTestId = (testId) => {
  const dropdownIcon = screen.getByTestId(testId);
  fireEvent.click(dropdownIcon);
};
/**
 * Toggles the reply section for a comment by its test id.
 *
 * @param {string} testId - The test id of the reply toggle icon.
 */
export const toggleReplyByTestId = (testId) => {
  const replyToggle = screen.getByTestId(testId);
  fireEvent.click(replyToggle);
};