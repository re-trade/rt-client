import React from 'react';

/**
 * Forces numeric input for phone fields and limits to specified max length
 * @param e The input change event
 * @param maxLength Maximum length of input (defaults to 10)
 */
export const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>, maxLength = 10): void => {
  const input = e.target;
  let value = input.value.replace(/\D/g, '');
  if (value.length > maxLength) {
    value = value.slice(0, maxLength);
  }
  input.value = value;
};

/**
 * Prevents non-numeric key presses for number inputs
 * @param e Keyboard event
 */
export const preventNonNumericInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  if (
    [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
    ].includes(e.key) ||
    (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()) && (e.ctrlKey || e.metaKey))
  ) {
    return;
  }

  // Block any key that isn't a number
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * Creates a custom handler for numeric inputs with max length
 * @param onChange Original change handler (optional)
 * @param maxLength Maximum length (defaults to 10)
 * @returns A new change handler function
 */
export const createNumericInputHandler = (
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  maxLength = 10,
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneInput(e, maxLength);
    if (onChange) {
      onChange(e);
    }
  };
};

/**
 * Limits text input to a specific maximum length
 * @param e The input change event
 * @param maxLength Maximum length of input
 */
export const limitTextLength = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  maxLength: number,
): void => {
  const input = e.target;

  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
};

/**
 * Removes spaces from input
 * @param e The input change event
 */
export const removeSpaces = (e: React.ChangeEvent<HTMLInputElement>): void => {
  e.target.value = e.target.value.replace(/\s/g, '');
};

/**
 * Formats a phone number as it's being typed (e.g., XXX-XXX-XXXX)
 * @param value The raw phone number input
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (value: string): string => {
  const phoneNumber = value.replace(/\D/g, '');
  if (phoneNumber.length < 4) {
    return phoneNumber;
  } else if (phoneNumber.length < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  } else {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
};
