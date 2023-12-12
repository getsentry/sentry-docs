import React from 'react';
import styled from '@emotion/styled';

type Video = {
  id: string;
  className?: string;
};

const ResponsiveEmbed = styled.div`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
  margin-bottom: 1rem;

  &:before {
    content: '';
    display: block;
    padding-top: 56.25%;
  }
`;

export function VimeoEmbed({id, className}: Video) {
  return (
    <ResponsiveEmbed className={className}>
      <StyledVimeoIframe
        src={`https://player.vimeo.com/video/${id}?dnt=true`}
        frameBorder="0"
        allowFullScreen
      />
    </ResponsiveEmbed>
  );
}

const StyledVimeoIframe = styled.iframe`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

export function YouTubeEmbed({id, className}: Video) {
  return (
    <ResponsiveEmbed className={className}>
      <StyledYouTubeIframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
    </ResponsiveEmbed>
  );
}

const StyledYouTubeIframe = styled.iframe`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;
