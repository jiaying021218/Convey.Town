// icon:egg | Fontawesome https://fontawesome.com/ | Fontawesome
import * as React from 'react';

/**
 * Renders an SVG icon of an egg
 *
 * @returns The JSX element representing the egg icon
 */
function EggIcon() {
  return (
    <svg
      viewBox='0 0 384 512'
      fill='burlywood'
      height='3em'
      width='3em'
      xmlns='http://www.w3.org/2000/svg'>
      <path d='M192 496C86 496 0 410 0 304 0 192 96 16 192 16s192 176 192 288c0 106-86 192-192 192zm-35.5-358c5.5-6.9 4.4-17-2.5-22.5s-17-4.4-22.5 2.5l12.5 10-12.5-10-.1.1-.2.2-.6.8c-.5.7-1.3 1.7-2.2 3-1.9 2.6-4.5 6.3-7.7 11-6.3 9.4-14.6 23-23 39.7C81.1 206.1 64 252.6 64 304c0 8.8 7.2 16 16 16s16-7.2 16-16c0-44.6 14.9-86.1 30.3-116.8 7.6-15.3 15.3-27.7 21-36.3 2.8-4.3 5.2-7.6 6.8-9.8.8-1.1 1.4-1.9 1.8-2.4l.4-.6.1-.1z' />
    </svg>
  );
}

export default EggIcon;
