import React from 'react';
import { render, screen } from '@testing-library/react';
import Modal from '@/app/(components)/Modal';

test('Modal renders when open', () => {
  render(
    <Modal isOpen={true} onClose={() => {}}>
      <div>Modal Content</div>
    </Modal>
  );
  expect(screen.getByText('Modal Content')).toBeInTheDocument();
});

test('Modal does not render when closed', () => {
  const { queryByText } = render(
    <Modal isOpen={false} onClose={() => {}}>
      <div>Should not appear</div>
    </Modal>
  );
  expect(queryByText('Should not appear')).toBeNull();
});
