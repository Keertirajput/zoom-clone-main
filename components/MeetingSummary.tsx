'use client';

import { useState } from 'react';

type MeetingSummaryProps = {
  transcript: string;
  onClose?: () => void;
};

const MeetingSummary = ({
  transcript,
  onClose,
}: MeetingSummaryProps) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    if (!transcript.trim()) {
      setError(
        'No meeting transcript is available yet. Start transcription and speak for a while before generating the summary.'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSummary('');

      const response = await fetch('/api/chat/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || 'Failed to generate summary'
        );
      }

      setSummary(data.summary || '');
    } catch (error) {
      console.error('Summary error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to generate meeting summary'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-5 top-5 z-50 w-[350px] max-w-[90vw] rounded-2xl bg-dark-2 p-5 text-white shadow-2xl">
      
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            AI Meeting Summary
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Generate a summary from the meeting conversation.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-3 text-xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={generateSummary}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? 'Generating Summary...'
          : 'Generate AI Summary'}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-900/40 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-lg bg-dark-3 p-4">
          <h3 className="mb-2 font-semibold text-white">
            Summary
          </h3>

          <div className="whitespace-pre-wrap text-sm leading-6 text-gray-200">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingSummary;