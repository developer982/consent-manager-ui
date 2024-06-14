import { h, JSX } from 'preact';
import { useIntl } from 'react-intl';
import { CONSENT_OPTIONS } from '../constants';
import { useAirgap, useAuth } from '../hooks';
import { messages } from '../messages';
import type { HandleSetViewState } from '../types';
import { Button } from './Button';

/**
 * Component showing explanatory text when privacy policy has changed
 */
export function PrivacyPolicyNotice({
  handleSetViewState,
}: {
  /** Function to change viewState */
  handleSetViewState: HandleSetViewState;
}): JSX.Element {
  const { airgap } = useAirgap();
  const { auth } = useAuth();
  const { formatMessage } = useIntl();

  // Opt in to all purposes
  const handlePrivacyPolicyNotice:
    | JSX.MouseEventHandler<HTMLButtonElement>
    | undefined = (
    event: JSX.TargetedEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    airgap.setConsent(auth || event, {}, CONSENT_OPTIONS);
    handleSetViewState('close');
  };

  return (
    <div className="column-content" role="none">
      <div>
        <div>
          <p
            id="consent-dialog-title"
            role="heading"
            className="text-title text-title-left"
          >
            {formatMessage(messages.consentTitlePrivacyPolicyNotice)}
          </p>
        </div>
        <div>
          <p className="paragraph">
            <div
              role="paragraph"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: formatMessage(messages.privacyPolicyNoticeDescription),
              }}
            />
          </p>
        </div>
      </div>
      <Button
        primaryText={formatMessage(messages.privacyPolicyNoticeButton)}
        handleClick={handlePrivacyPolicyNotice}
        initialFocus
      />
    </div>
  );
}
