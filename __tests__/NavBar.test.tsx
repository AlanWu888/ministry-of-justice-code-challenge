import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '@/app/(components)/NavBar';
import { Task } from '@/types/task';

const mockTasks: Task[] = [
  { id: 1, title: 'Test Task One', description: '', dueDate: '2025-07-01T00:00', status: 'TODO', archived: false, createdAt: '2025-06-01T00:00', updatedAt: '2025-06-10T00:00'},
  { id: 2, title: 'Archived Task', description: '', dueDate: '2025-07-01T00:00', status: 'DONE', archived: true, createdAt: '2025-06-01T00:00', updatedAt: '2025-06-10T00:00'},
];

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
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    expect(screen.getByText('Test Task One')).toBeInTheDocument();
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
      target: { value: 'Archived' },
    });

    fireEvent.click(screen.getByText('Archived Task'));
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
