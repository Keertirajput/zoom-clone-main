'use client';

import { useEffect, useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import Loader from './Loader';
import EndCallButton from './EndCallButton';
import MeetingSummary from './MeetingSummary';
import { cn } from '@/lib/utils';

type CallLayoutType =
  | 'grid'
  | 'speaker-left'
  | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();

  const isPersonalRoom =
    !!searchParams.get('personal');

  const router = useRouter();

  const [layout, setLayout] =
    useState<CallLayoutType>('speaker-left');

  const [showParticipants, setShowParticipants] =
    useState(false);

  // Stores the meeting transcript
  const [transcript, setTranscript] =
    useState('');

  // Controls the AI Summary window
  const [showSummary, setShowSummary] =
    useState(false);

  // Get the current Stream call
  const call = useCall();

  const { useCallCallingState } =
    useCallStateHooks();

  const callingState =
    useCallCallingState();

  /*
   * ==========================================
   * STREAM CLOSED CAPTIONS
   * ==========================================
   */

  useEffect(() => {
    if (!call) return;

    // Your installed Stream SDK can have
    // a TypeScript event-type mismatch.
    const streamCall = call as any;

    const unsubscribe = streamCall.on(
      'call.closed_caption',
      (event: any) => {
        const caption =
          event?.closed_caption;

        if (!caption?.text) return;

        const speaker =
          caption?.user?.name ||
          caption?.user?.id ||
          'Participant';

        const newLine =
          `${speaker}: ${caption.text}`;

        setTranscript((previous) => {
          // Prevent duplicate captions
          if (previous.includes(newLine)) {
            return previous;
          }

          if (!previous) {
            return newLine;
          }

          return `${previous}\n${newLine}`;
        });
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [call]);

  /*
   * ==========================================
   * TEST TRANSCRIPT
   * ==========================================
   *
   * This is only for testing the AI Summary
   * feature before real Stream captions work.
   */

  const addTestTranscript = () => {
    const testConversation = `
Participant 1: Today we discussed our upcoming project.
Participant 2: The project will focus on developing an AI based meeting assistant.
Participant 1: We decided to complete the frontend first and then connect the backend API.
Participant 2: We also need to test the meeting recording and transcript features.
Participant 1: The team will meet again next Monday to review the progress.
Participant 2: Everyone should complete their assigned tasks before the next meeting.
`;

    setTranscript(testConversation.trim());

    // Open AI Summary automatically
    setShowSummary(true);
  };

  /*
   * ==========================================
   * CLEAR TEST TRANSCRIPT
   * ==========================================
   */

  const clearTranscript = () => {
    setTranscript('');
  };

  /*
   * ==========================================
   * WAIT UNTIL USER JOINS
   * ==========================================
   */

  if (callingState !== CallingState.JOINED) {
    return <Loader />;
  }

  /*
   * ==========================================
   * VIDEO LAYOUT
   * ==========================================
   */

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;

      case 'speaker-right':
        return (
          <SpeakerLayout
            participantsBarPosition="left"
          />
        );

      default:
        return (
          <SpeakerLayout
            participantsBarPosition="right"
          />
        );
    }
  };

  /*
   * ==========================================
   * MAIN UI
   * ==========================================
   */

  return (
    <section
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        pt-4
        text-white
      "
    >
      {/* ================= VIDEO AREA ================= */}

      <div
        className="
          relative
          flex
          size-full
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            size-full
            max-w-[1000px]
            items-center
          "
        >
          <CallLayout />
        </div>

        {/* ================= PARTICIPANTS ================= */}

        <div
          className={cn(
            'h-[calc(100vh-86px)] hidden ml-2',
            {
              'show-block':
                showParticipants,
            }
          )}
        >
          <CallParticipantsList
            onClose={() =>
              setShowParticipants(false)
            }
          />
        </div>
      </div>

      {/* ================= BOTTOM CONTROLS ================= */}

      <div
        className="
          fixed
          bottom-0
          flex
          w-full
          items-center
          justify-center
          gap-5
          flex-wrap
          pb-2
        "
      >
        {/* Microphone / Camera / Leave */}

        <CallControls
          onLeave={() =>
            router.push('/home')
          }
        />

        {/* ================= LAYOUT BUTTON ================= */}

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger
              className="
                cursor-pointer
                rounded-2xl
                bg-[#19232d]
                px-4
                py-2
                hover:bg-[#4c535b]
              "
            >
              <LayoutList
                size={20}
                className="text-white"
              />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent
            className="
              border-dark-1
              bg-dark-1
              text-white
            "
          >
            {[
              'Grid',
              'Speaker-Left',
              'Speaker-Right',
            ].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(
                      item.toLowerCase() as CallLayoutType
                    )
                  }
                >
                  {item}
                </DropdownMenuItem>

                <DropdownMenuSeparator
                  className="border-dark-1"
                />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ================= CALL STATS ================= */}

        <CallStatsButton />

        {/* ================= TEST TRANSCRIPT ================= */}

        <button
          type="button"
          onClick={addTestTranscript}
          className="
            cursor-pointer
            rounded-2xl
            bg-green-600
            px-4
            py-2
            text-white
            hover:bg-green-700
          "
        >
          Test Transcript
        </button>

        {/* ================= CLEAR TEST ================= */}

        {transcript && (
          <button
            type="button"
            onClick={clearTranscript}
            className="
              cursor-pointer
              rounded-2xl
              bg-red-600
              px-4
              py-2
              text-white
              hover:bg-red-700
            "
          >
            Clear Test
          </button>
        )}

        {/* ================= AI SUMMARY ================= */}

        <button
          type="button"
          onClick={() =>
            setShowSummary(
              (previous) => !previous
            )
          }
          className="
            cursor-pointer
            rounded-2xl
            bg-[#19232d]
            px-4
            py-2
            text-white
            hover:bg-[#4c535b]
          "
        >
          AI Summary
        </button>

        {/* ================= PARTICIPANTS ================= */}

        <button
          type="button"
          onClick={() =>
            setShowParticipants(
              (previous) => !previous
            )
          }
        >
          <div
            className="
              cursor-pointer
              rounded-2xl
              bg-[#19232d]
              px-4
              py-2
              hover:bg-[#4c535b]
            "
          >
            <Users
              size={20}
              className="text-white"
            />
          </div>
        </button>

        {/* ================= END CALL ================= */}

        {!isPersonalRoom && (
          <EndCallButton />
        )}
      </div>

      {/* ================= AI SUMMARY WINDOW ================= */}

      {showSummary && (
        <MeetingSummary
          transcript={transcript}
        />
      )}
    </section>
  );
};

export default MeetingRoom;