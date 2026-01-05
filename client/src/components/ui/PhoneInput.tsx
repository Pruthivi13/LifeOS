'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

const countryCodes = [
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+971', country: 'AE', flag: '🇦🇪' },
    { code: '+65', country: 'SG', flag: '🇸🇬' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
];

export default function PhoneInput({ value, onChange, disabled, className }: PhoneInputProps) {
    const [selectedCode, setSelectedCode] = useState(countryCodes[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [localNumber, setLocalNumber] = useState('');

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const number = e.target.value.replace(/\D/g, '').slice(0, 10);
        setLocalNumber(number);
        onChange(`${selectedCode.code}${number}`);
    };

    const handleCodeChange = (code: typeof countryCodes[0]) => {
        setSelectedCode(code);
        setIsOpen(false);
        if (localNumber) {
            onChange(`${code.code}${localNumber}`);
        }
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            {/* Country Code Dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="flex items-center gap-1 px-3 py-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors min-w-[90px] disabled:opacity-50"
                >
                    <span className="text-lg">{selectedCode.flag}</span>
                    <span className="text-sm font-medium">{selectedCode.code}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-card border border-border rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {countryCodes.map((code) => (
                            <button
                                key={code.code}
                                type="button"
                                onClick={() => handleCodeChange(code)}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted transition-colors text-left"
                            >
                                <span className="text-lg">{code.flag}</span>
                                <span className="text-sm">{code.code}</span>
                                <span className="text-xs text-muted-foreground">{code.country}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Phone Number Input */}
            <input
                type="tel"
                placeholder="1234567890"
                value={localNumber}
                onChange={handleNumberChange}
                disabled={disabled}
                className="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
                maxLength={10}
            />
        </div>
    );
}
