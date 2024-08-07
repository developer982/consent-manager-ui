import { ObjByString } from '@transcend-io/type-utils';
import { h, JSX } from 'preact';
import { useIntl } from 'react-intl';
import { CONSENT_OPTIONS } from '../constants';
import { useAirgap } from '../hooks';
import { messages } from '../messages';
import type { HandleSetViewState } from '../types';
import { Button } from './Button';

/**
 * Component showing "accept" or "reject" for Advertising purpose
 */
export function AcceptOrRejectAdvertising({
  handleSetViewState,
  globalUiVariables,
}: {
  /** Function to change viewState */
  handleSetViewState: HandleSetViewState;
  /** Global UI variables to pass to messages */
  globalUiVariables: ObjByString;
}): JSX.Element {
  const { airgap } = useAirgap();
  const { formatMessage } = useIntl();

  return (
    <div className="column-content" role="none">
      <div>
        <div>
          <p
            id="consent-dialog-title"
            role="heading"
            className="text-title text-title-left"
          >
            {formatMessage(
              messages.consentTitleAcceptOrRejectAdvertising,
              globalUiVariables,
            )}
          </p>
        </div>
        <div>
          <p className="paragraph">
            <div
              role="paragraph"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: formatMessage(
                  messages.acceptOrRejectAdvertisingDescription,
                  globalUiVariables,
                ),
              }}
            />
          </p>
        </div>
      </div>
      <div
        className="accept-or-reject-all-button-row"
        role="group"
        aria-label={formatMessage(
          messages.buttonGroupAriaDescription,
          globalUiVariables,
        )}
      >
        <Button
          primaryText={formatMessage(
            messages.acceptAdvertising,
            globalUiVariables,
          )}
          handleClick={(event) => {
            event.preventDefault();
            airgap.setConsent(event, { Advertising: true }, CONSENT_OPTIONS);
            handleSetViewState('close');
          }}
        />
        <Button
          primaryText={formatMessage(
            messages.rejectAdvertising,
            globalUiVariables,
          )}
          handleClick={(event) => {
            event.preventDefault();
            airgap.setConsent(event, { Advertising: false }, CONSENT_OPTIONS);
            handleSetViewState('close');
          }}
          initialFocus
        />
      </div>
    </div>
  );
}
