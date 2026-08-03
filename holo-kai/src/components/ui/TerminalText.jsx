import React, { useState, useEffect, useRef } from 'react';
import { retroAudio } from '@/lib/audioFeedback';

/**
 * TerminalText component that provides a realistic typing animation
 * with customizable speed, cursor blinking, audio click feedback, and completion callback.
 */
export default function TerminalText({
  text,
  speed = 25,
  delay = 0,
  cursor = true,
  cursorChar = '█',
  className = '',
  prefix = '',
  playSound = true,
  onComplete,
  skipOnClick = true,
}) {
  const fullText = Array.isArray(text) ? text.join('\n') : (text || '');
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayedLength(0);
    setIsComplete(false);
    setIsStarted(false);

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [fullText, delay]);

  useEffect(() => {
    if (!isStarted || isComplete) return;

    if (displayedLength >= fullText.length) {
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    timerRef.current = setTimeout(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        if (playSound && next % 2 === 0) {
          retroAudio.playTerminalKeyClick();
        }
        return next;
      });
    }, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isStarted, displayedLength, fullText, speed, isComplete, playSound, onComplete]);

  const handleContainerClick = () => {
    if (skipOnClick && !isComplete && isStarted) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayedLength(fullText.length);
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  };

  const currentDisplay = fullText.slice(0, displayedLength);

  return (
    <span
      onClick={handleContainerClick}
      className={`font-mono inline-block ${skipOnClick && !isComplete ? 'cursor-pointer select-none' : ''} ${className}`}
      title={skipOnClick && !isComplete ? 'Click to reveal full text' : undefined}
    >
      {prefix && <span className="text-amber-500/80 mr-2 font-bold">{prefix}</span>}
      <span className="whitespace-pre-wrap">{currentDisplay}</span>
      {cursor && (
        <span
          className={`inline-block text-amber-400 ml-1 font-bold ${
            isComplete ? 'animate-pulse opacity-70' : 'animate-ping text-amber-300'
          }`}
          style={{ animationDuration: isComplete ? '1s' : '0.6s' }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}
