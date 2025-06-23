import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '@/app/(components)/NavBar';
import { mockTasks } from '../__mocks__/mockTasks';

describe('NavBar', () => {
  const onTaskCreated = jest.fn();
  const onEditTask = jest.fn();
  const onOpenArchive = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders NavBar with search and new task button', () => {
    render(
      <NavBar
        onTaskCreated={onTaskCreated}
        onEditTask={onEditTask}
        onOpenArchive={onOpenArchive}
        tasks={mockTasks}
      />
    );

    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
    expect(screen.getByText('+ New Task')).toBeInTheDocument();
  });

  it('filters tasks when typing in search input', () => {
    render(
      <NavBar
        onTaskCreated={onTaskCreated}
        onEditTask={onEditTask}
        onOpenArchive={onOpenArchive}
        tasks={mockTasks}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: mockTasks[0].title.split(' ')[0] } });

    expect(screen.getByText(mockTasks[0].title)).toBeInTheDocument();
  });

  it('triggers onEditTask when a search result is clicked', () => {
    render(
      <NavBar
        onTaskCreated={onTaskCreated}
        onEditTask={onEditTask}
        onOpenArchive={onOpenArchive}
        tasks={mockTasks}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/search tasks/i), {
      target: { value: mockTasks[1].title },
    });

    fireEvent.click(screen.getByText(mockTasks[1].title));
    expect(onEditTask).toHaveBeenCalledWith(mockTasks[1]);
  });

  it('opens modal when clicking "+ New Task" button', () => {
    render(
      <NavBar
        onTaskCreated={onTaskCreated}
        onEditTask={onEditTask}
        onOpenArchive={onOpenArchive}
        tasks={mockTasks}
      />
    );

    fireEvent.click(screen.getByText('+ New Task'));
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('calls onOpenArchive when Archive button is clicked', () => {
    render(
      <NavBar
        onTaskCreated={onTaskCreated}
        onEditTask={onEditTask}
        onOpenArchive={onOpenArchive}
        tasks={mockTasks}
      />
    );

    fireEvent.click(screen.getByText('Archive'));
    expect(onOpenArchive).toHaveBeenCalled();
  });
});
