'use client';

import * as React from 'react';
import { Tweet } from 'react-tweet';

import type { TMediaEmbedElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import { parseTwitterUrl, parseVideoUrl } from '@platejs/media';
import { MediaEmbedPlugin, useMediaState } from '@platejs/media/react';
import { ResizableProvider, useResizableValue } from '@platejs/resizable';
import { PlateElement, withHOC } from 'platejs/react';

import { cn } from '@/lib/utils';

import { Caption, CaptionTextarea } from './caption';
import { MediaToolbar } from './media-toolbar';
import {
  mediaResizeHandleVariants,
  Resizable,
  ResizeHandle,
} from './resize-handle';

export const MediaEmbedElement = withHOC(
  ResizableProvider,
  function MediaEmbedElement(props: PlateElementProps<TMediaEmbedElement>) {
    const {
      align = 'center',
      embed,
      focused,
      isTweet,
      isVideo,
      isYoutube,
      readOnly,
      selected,
    } = useMediaState({
      urlParsers: [parseTwitterUrl, parseVideoUrl],
    });
    const width = useResizableValue('width');
    const provider = embed?.provider;

    return (
      <MediaToolbar plugin={MediaEmbedPlugin}>
        <PlateElement className="py-2.5" {...props}>
          <figure
            className="group relative m-0 w-full cursor-default"
            contentEditable={false}
          >
            <Resizable
              align={align}
              options={{
                align,
                maxWidth: isTweet ? 550 : '100%',
                minWidth: isTweet ? 300 : 100,
              }}
            >
              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: 'left' })}
                options={{ direction: 'left' }}
              />

              {isVideo ? (
                isYoutube ? (
                  <div className={cn('relative pb-[56.25%] rounded-sm', focused && selected && 'ring-2 ring-ring ring-offset-2')}>
                    <iframe
                      className="absolute top-0 left-0 size-full rounded-sm border-0"
                      title="youtube"
                      src={`https://www.youtube.com/embed/${embed!.id!}`}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      provider === 'vimeo' && 'pb-[75%]',
                      provider === 'youku' && 'pb-[56.25%]',
                      provider === 'dailymotion' && 'pb-[56.0417%]',
                      provider === 'coub' && 'pb-[51.25%]'
                    )}
                  >
                    <iframe
                      className={cn(
                        'absolute top-0 left-0 size-full rounded-sm',
                        isVideo && 'border-0',
                        focused && selected && 'ring-2 ring-ring ring-offset-2'
                      )}
                      title="embed"
                      src={embed!.url}
                      allowFullScreen
                    />
                  </div>
                )
              ) : null}

              {isTweet && (
                <div
                  className={cn(
                    '[&_.react-tweet-theme]:my-0',
                    !readOnly &&
                    selected &&
                    '[&_.react-tweet-theme]:ring-2 [&_.react-tweet-theme]:ring-ring [&_.react-tweet-theme]:ring-offset-2'
                  )}
                >
                  <Tweet id={embed!.id!} />
                </div>
              )}

              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: 'right' })}
                options={{ direction: 'right' }}
              />
            </Resizable>

            <Caption style={{ width }} align={align}>
              <CaptionTextarea placeholder="Write a caption..." />
            </Caption>
          </figure>

          {props.children}
        </PlateElement>
      </MediaToolbar>
    );
  }
);
