import React from 'react';

interface TimelineEvent {
  date: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="timeline-container">
      {events.map((event, index) => (
        <div key={index} className="timeline-item mb-8 flex items-center">
          <div className="timeline-icon bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center text-white">
            {index + 1}
          </div>
          <div className="timeline-content ml-4">
            <p className="text-sm text-gray-500">{event.date}</p>
            <p className="text-lg font-semibold">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};