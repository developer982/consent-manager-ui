import '@testing-library/jest-dom';

import { h } from 'preact';
import { render } from './utils/render';
import { clickPurposeCheckbox, getPurposeCheckState } from './utils/checkbox';
import { test, expect } from '@jest/globals';

import { CompleteOptions } from '../components/CompleteOptions';
import { fireEvent } from '@testing-library/preact';
import { MOCK_PURPOSES } from './constants';
import { DEFAULT_PURPOSE_TO_MESSAGE_KEY } from '../components/constants';
import { sortByPurposeOrder } from '../helpers';

test('CompleteOptions', () => {
  const prevPurposes = { ...window.airgap?.getConsent().purposes };

  let screen = render(<CompleteOptions handleSetViewState={() => null} />);
  let { container, snapshot, unmount } = screen;

  expect(snapshot).toMatchSnapshot();

  // Ensure purpose ordering remains consistent
  const sortedNamesToLabels = [
    DEFAULT_PURPOSE_TO_MESSAGE_KEY.Essential.defaultMessage,
    ...Object.values(MOCK_PURPOSES)
      .map((purpose) => [purpose.name] as [string])
      .sort(sortByPurposeOrder)
      .map(([purposeName]) =>
        purposeName in DEFAULT_PURPOSE_TO_MESSAGE_KEY
          ? DEFAULT_PURPOSE_TO_MESSAGE_KEY[purposeName].defaultMessage
          : purposeName,
      ),
  ];

  const domLabels = [...container.querySelectorAll('form label')]
    ?.map((label) =>
      [...label.childNodes].find((child) => child.nodeType === 3),
    )
    .map((labelTextNode) => (labelTextNode as Text).textContent);

  expect(sortedNamesToLabels).toStrictEqual(domLabels);

  // Ensure defaults are honored and check states change when clicked
  (
    Object.entries(MOCK_PURPOSES) as [
      keyof typeof MOCK_PURPOSES,
      (typeof MOCK_PURPOSES)[keyof typeof MOCK_PURPOSES],
    ][]
  ).forEach(([key, purpose]) => {
    const label =
      purpose.name in DEFAULT_PURPOSE_TO_MESSAGE_KEY
        ? DEFAULT_PURPOSE_TO_MESSAGE_KEY[purpose.name].defaultMessage
        : purpose.name;
    expect(getPurposeCheckState(screen, label)).toEqual(
      MOCK_PURPOSES[key].defaultConsent,
    );
    clickPurposeCheckbox(screen, label);
    expect(getPurposeCheckState(screen, label)).toEqual(
      !MOCK_PURPOSES[key].defaultConsent,
    );
  });

  // Ensure submission reflects purpose selection in airgap
  const submitButton = container.querySelector('button[type=submit]');
  if (submitButton) fireEvent.click(submitButton);

  const purposes = { ...window.airgap?.getConsent().purposes };

  Object.entries(MOCK_PURPOSES).forEach(([, purpose]) => {
    expect(!!prevPurposes?.[purpose.name]).toEqual(!purposes?.[purpose.name]);
  });

  unmount();

  screen = render(<CompleteOptions handleSetViewState={() => null} />);
  ({ container, snapshot, unmount } = screen);

  // Ensure we rerender the ui with the new consent when unmounting and remounting ui
  (
    Object.entries(MOCK_PURPOSES) as [
      keyof typeof MOCK_PURPOSES,
      (typeof MOCK_PURPOSES)[keyof typeof MOCK_PURPOSES],
    ][]
  ).forEach(([key, purpose]) => {
    const label =
      purpose.name in DEFAULT_PURPOSE_TO_MESSAGE_KEY
        ? DEFAULT_PURPOSE_TO_MESSAGE_KEY[purpose.name].defaultMessage
        : purpose.name;
    expect(getPurposeCheckState(screen, label)).toEqual(
      !MOCK_PURPOSES[key].defaultConsent,
    );
  });
});
