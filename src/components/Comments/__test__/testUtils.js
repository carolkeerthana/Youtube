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
