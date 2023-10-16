import React, { useRef, useState } from 'react';
import './tooltip.css';
import {
  colorBackgroundHomeHeader,
  colorBackgroundLayoutMain,
  spaceScaledM,
  spaceStaticS,
  spaceStaticXs,
  spaceStaticXxxs,
} from '@cloudscape-design/design-tokens';

const Tooltip = ({
  content,
  position,
  children,
}: {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isNameTruncated, setIsNameTruncated] = useState(false);
  const tooltipStyle = {
    fontSize: spaceScaledM,
    color: colorBackgroundHomeHeader,
    backgroundColor: colorBackgroundLayoutMain,
    padding: spaceStaticS,
    borderRadius: spaceStaticXs,
    border: `${spaceStaticXxxs} solid ${colorBackgroundHomeHeader}`,
    ...(isNameTruncated && { width: '400px', right: '0', bottom: '-150%' }),
  };

  const handleMouseEnter = () => {
    if (contentRef.current) {
      setIsNameTruncated(contentRef.current.clientWidth > 420);
    }
  };

  const handleMouseLeave = () => {
    setIsNameTruncated(false);
  };

  return (
    <div className='tooltip-container' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {content && (
        <div
          className={`tooltip-text ${position}`}
          style={{
            ...tooltipStyle,
            whiteSpace: !isNameTruncated ? 'nowrap' : 'pre-wrap',
          }}
          ref={contentRef}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
