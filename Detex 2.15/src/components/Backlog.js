import React from 'react';
import './backlog.css'; // Ensure the case matches your actual file name

function Backlog() {
  const backlogItems = [
    { id: 1, title: 'Issue #1', description: 'Fix alignment in the user table', status: 'Open' },
    { id: 2, title: 'Issue #2', description: 'Update color scheme for dashboard charts', status: 'Closed' },
    { id: 3, title: 'Issue #3', description: 'Optimize loading times for image logs', status: 'In Progress' }
  ];

  return (
    <div className="box-container">
      <h1>Backlog</h1>
      <div className="image-container">
        <img src="https://via.placeholder.com/500" alt="Placeholder" />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {backlogItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Backlog;
