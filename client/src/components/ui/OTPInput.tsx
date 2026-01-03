'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { motion } from 'framer-motion';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export function OTPInput({ length = 6, onComplete, disabled = false, error = false }: OTPInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount
    useEffect(() => {
        if (!disabled && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [disabled]);

    // Check if complete whenever values change
    useEffect(() => {
        const otp = values.join('');
        if (otp.length === length && values.every(v => v !== '')) {
            onComplete(otp);
        }
    }, [values, length, onComplete]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        const digit = value.replace(/\D/g, '').slice(-1);

        const newValues = [...values];
        newValues[index] = digit;
        setValues(newValues);

        // Move to next input if digit entered
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (values[index] === '' && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newValues = [...values];
                newValues[index] = '';
                setValues(newValues);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            const newValues = [...values];
            for (let i = 0; i < pastedData.length; i++) {
                newValues[i] = pastedData[i];
            }
            setValues(newValues);

            // Focus last filled input or the next empty one
            const lastIndex = Math.min(pastedData.length, length) - 1;
            inputRefs.current[lastIndex]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {values.map((value, index) => (
                <motion.input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`
                        w-10 h-12 sm:w-12 sm:h-14 
                        text-center text-xl sm:text-2xl font-bold
                        rounded-xl border-2 
                        bg-background/50 backdrop-blur-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error
                            ? 'border-red-500 text-red-500 shake'
                            : value
                                ? 'border-primary text-foreground'
                                : 'border-foreground/20 text-foreground'
                        }
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                />
            ))}
        </div>
    );
}

// Resend timer component
interface ResendTimerProps {
    seconds: number;
    onResend: () => void;
    disabled?: boolean;
}

export function ResendTimer({ seconds, onResend, disabled = false }: ResendTimerProps) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleResend = () => {
        if (canResend && !disabled) {
            onResend();
            setTimeLeft(seconds);
            setCanResend(false);
        }
    };

    return (
        <div className="text-center text-sm text-foreground-muted">
            {canResend ? (
                <button
                    onClick={handleResend}
                    disabled={disabled}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                >
                    Resend OTP
                </button>
            ) : (
                <span>
                    Resend in <span className="font-medium text-foreground">{timeLeft}s</span>
                </span>
            )}
        </div>
    );
}
