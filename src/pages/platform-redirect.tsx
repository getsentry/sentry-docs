import React, { useEffect } from "react";
import { useNavigate, useLocation } from "@reach/router";
import { parse } from "query-string";
import { PlatformIcon } from "platformicons";

import Layout from "../components/layout";
import SmartLink from "../components/smartLink";
import { usePlatformList } from "../components/hooks/usePlatform";

type Props = {
  path?: string;
};

const PlatformRedirect = ({ path = "/" }: Props) => {
  const platformList = usePlatformList();

  return (
    <Layout>
      <h1>Platform Specific Content</h1>
      <p>
        The page you are looking for is customized for each platform. Select
        your platform below and we&apos;ll direct you to the most specific
        documentation on it.
      </p>

      <ul>
        {platformList.map(platform => (
          <li key={platform.key}>
            <SmartLink to={`/platforms/${platform.key}${path}`}>
              <PlatformIcon
                size={16}
                platform={platform.key}
                style={{ marginRight: "0.5rem" }}
                format="lg"
              />
              <h4 style={{ display: "inline-block" }}>{platform.title}</h4>
            </SmartLink>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryString = parse(location.search, { arrayFormat: "none" });
  const path = (queryString.next as string | null) || "";
  const platform = queryString.platform as string | null;

  if (platform) {
    useEffect(() => {
      navigate(`/platforms/${platform}${path}`);
    });
    return null;
  }

  return <PlatformRedirect path={path || ""} />;
};
