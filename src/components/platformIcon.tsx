import React from "react";

const PLATFORM_TO_ICON = {
  apple: "apple",
  cocoa: "apple",
  cordova: "cordova",
  csharp: "csharp",
  dotnet: "csharp",
  elixir: "elixir",
  electron: "electron",
  go: "go",
  java: "java",
  "java.android": "java",
  "java.appengine": "app-engine",
  "java.log4j": "java",
  "java.log4j2": "java",
  "java.logback": "java",
  "java.logging": "java",
  javascript: "javascript",
  "javascript.angular": "angularjs",
  "javascript.backbone": "javascript",
  "javascript.ember": "ember",
  "javascript.react": "react",
  "javascript.vue": "vue",
  node: "nodejs",
  "node.connect": "nodejs",
  "node.express": "nodejs",
  "node.koa": "nodejs",
  "objective-c": "apple",
  perl: "perl",
  php: "php",
  "php.laravel": "laravel",
  "php.monolog": "php",
  "php.symfony": "php",
  python: "python",
  "python.flask": "flask",
  "python.sanic": "python",
  "python.bottle": "bottle",
  "python.celery": "python",
  "python.django": "django",
  "python.pylons": "python",
  "python.pyramid": "python",
  "python.rq": "python",
  "python.tornado": "python",
  "python.pythonawslambda": "python",
  ruby: "ruby",
  "ruby.rack": "ruby",
  "ruby.rails": "rails",
  // "react-native": "react-native",
  rust: "rust",
  swift: "swift",
  flutter: "flutter",
  dart: "dart",
  // TODO: AWS used to be python-awslambda but the displayed generic icon
  // We need to figure out what is causing it to be python-pythonawslambda
};

export function getIcon(platform: string): string {
  let icon = PLATFORM_TO_ICON[platform];
  if (icon) {
    return icon;
  }
  if (platform.indexOf(".")) {
    icon = PLATFORM_TO_ICON[platform.split(".", 2)[0]];
  }
  if (icon) {
    return icon;
  }
  return "generic";
}

type Props = {
  platform: string;
  size?: string | number;
};

const PlatformIcon = ({ platform, size = 64, ...props }: Props) => {
  const icon = getIcon(platform);

  return (
    <img
      src={require(`platformicons/svg/${icon}.svg`)}
      width={size}
      height={size}
      style={{ maxWidth: "none", border: 0, boxShadow: "none" }}
      {...props}
    />
  );
};

export default PlatformIcon;
