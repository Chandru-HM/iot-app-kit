import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '~/components/tooltip/tooltip';

describe('Tooltip', () => {
  it('should truncate label and show tooltip on hover', () => {
    const label = 'This is a long label that needs to be truncated';

    render(
      <Tooltip content={label} position='top'>
        <div className='property-display-label'>{label}</div>
      </Tooltip>
    );

    const [labelElement] = screen.getAllByText(label);
    const tooltipElement = screen.queryAllByText(label);

    expect(labelElement).not.toHaveStyle('text-overflow: ellipsis');
    expect(labelElement).not.toHaveStyle('overflow: hidden');

    userEvent.hover(labelElement);

    expect(tooltipElement[0]).toBeInTheDocument();
  });

  it('should not truncate label and hide tooltip when label is not truncated', () => {
    const label = 'Short label';

    render(
      <Tooltip content={label} position='top'>
        <div className='property-display-label'>{label}</div>
      </Tooltip>
    );

    const [labelElement] = screen.getAllByText(label);
    const tooltipElement = screen.queryAllByText(label);

    expect(labelElement).not.toHaveStyle('text-overflow: ellipsis');
    expect(labelElement).not.toHaveStyle('overflow: hidden');
    expect(tooltipElement[0]).toBeInTheDocument();

    userEvent.hover(labelElement);

    expect(tooltipElement[0]).toBeInTheDocument();
  });
});
