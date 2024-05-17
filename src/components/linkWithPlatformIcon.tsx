import {PlatformIcon} from './platformIcon';
import {SmartLink} from './smartLink';

type Props = {
  label?: string;
  platform?: string;
  url?: string;
};

export function LinkWithPlatformIcon({platform, label, url}: Props) {
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
    </span>
  );
}
