import {CopyPromptButton} from './copyPromptButton';
import {PlatformIcon} from './platformIcon';
import {SmartLink} from './smartLink';

type Props = {
  label?: string;
  platform?: string;
  /** Agent skill name, e.g. "sentry-react-sdk". When provided, renders an inline "Agent Setup" copy-prompt button. */
  skill?: string;
  url?: string;
};

export function LinkWithPlatformIcon({platform, label, url, skill}: Props) {
  if (!platform) {
    return null;
  }
  return (
    <span style={{whiteSpace: 'nowrap'}}>
      <SmartLink to={url}>
        <PlatformIcon
          size={20}
          platform={platform}
          style={{
            marginRight: '0.5rem',
            marginTop: '0.2rem',
            border: 0,
            boxShadow: 'none',
          }}
          format="sm"
        />
        {label ?? platform}
      </SmartLink>
      {skill && <CopyPromptButton skill={skill} platformName={label ?? platform} />}
    </span>
  );
}
