'use client';

import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600">Plan and schedule your social media posts</p>
      </div>

      <div className="card text-center py-12">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Scheduling Coming Soon
        </h3>
        <p className="text-gray-600">
          Calendar view and post scheduling will be available in the next update
        </p>
      </div>
    </div>
  );
}
