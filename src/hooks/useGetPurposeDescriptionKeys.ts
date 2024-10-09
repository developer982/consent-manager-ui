import type {
  TrackingPurposesDetails,
  TrackingPurposesTypes,
} from '@transcend-io/airgap.js-types';

import { ConsentSelection } from '../types';
import { defaultTrackingPurposes } from 'src/playground/defaults';

import { useMemo } from 'preact/hooks';

import { DefinedMessage } from '@transcend-io/internationalization';

const CUSTOM_PURPOSE_DESCRIPTION_PREFIX = 'cm-ui.purposeDescription';
const DEFAULT_PURPOSE_DESCRIPTION_PREFIX = 'ui.src.CompleteOptions'

export const useGetPurposeDescriptionKeys = ({
  consentSelection,
  defaultPurposeToDescriptionKey,
  airgapPurposes,
}: {
  /** The configured airgap purpose types */
  consentSelection: ConsentSelection;
  /** The lookup of messages for default purpose types */
  defaultPurposeToDescriptionKey: Record<string, DefinedMessage>;
  /** Airgap purposes data */
  airgapPurposes: TrackingPurposesTypes;
}): Record<string, DefinedMessage> => {
  const purposeToDescriptionKey: Record<string, DefinedMessage> = useMemo(
    () =>
      // the purpose type is unique for the bundle
      Object.keys(consentSelection ?? {}).reduce((allMessages, purposeType) => {
        if (allMessages[purposeType]) {
          return allMessages;
        }
        const purposeMessageDescriptionId = Object.values(defaultTrackingPurposes).find(
          (defaultPurpose) => (defaultPurpose as TrackingPurposesDetails).trackingType === purposeType,
        ) ? `${DEFAULT_PURPOSE_DESCRIPTION_PREFIX}.${purposeType.charAt(0).toLowerCase()}${purposeType.slice(1)}Description` :
        `${CUSTOM_PURPOSE_DESCRIPTION_PREFIX}.${purposeType}`;
        return {
          ...allMessages,
          [purposeType]: {
            id: purposeMessageDescriptionId,
            defaultMessage: airgapPurposes[purposeType]?.description,
            description: `Translatable description for purpose '${purposeType}'`,
          } as DefinedMessage,
        };
      }, defaultPurposeToDescriptionKey as Record<string, DefinedMessage>),
    [consentSelection, defaultPurposeToDescriptionKey],
  );

  return purposeToDescriptionKey;
};
