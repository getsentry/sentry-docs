type Props = {
  children?: React.ReactNode;
  noGuides?: boolean;
  notSupported?: string[];
  platform?: string;
  supported?: string[];
};

export function PlatformSection({
  supported = [],
  notSupported = [],
  platform,
  noGuides,
  children,
}: Props) {
  return children;
}
