'use client';

import { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  // Ensure all boolean props have explicit values
  const safeProps = {
    ...props,
    isDropDisabled: props.isDropDisabled === true,
    isCombineEnabled: props.isCombineEnabled === true,
    ignoreContainerClipping: props.ignoreContainerClipping === true,
  };

  return (
    <Droppable {...safeProps}>
      {children}
    </Droppable>
  );
}; 