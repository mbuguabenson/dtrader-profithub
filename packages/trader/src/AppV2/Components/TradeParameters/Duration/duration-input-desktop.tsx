import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, TextField } from '@deriv-com/quill-ui';
import { Localize, useTranslations } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

type TDurationInputDesktopProps = {
    onClose: () => void;
};

const MIN_SECONDS = 15;
const MAX_SECONDS = 60;

const DurationInputDesktop: React.FC<TDurationInputDesktopProps> = observer(({ onClose }) => {
    const { localize } = useTranslations();
    const { duration, duration_unit, onChangeMultiple } = useTraderStore();

    const [inputValue, setInputValue] = useState<string>(duration_unit === 's' ? String(duration) : '');
    const [error, setError] = useState<string>('');

    const validateInput = useCallback(
        (value: string): boolean => {
            if (!value) {
                setError(localize('Duration is a required field.'));
                return false;
            }

            const numValue = Number(value);
            if (isNaN(numValue)) {
                setError(localize('Should be a valid number.'));
                return false;
            }

            if (numValue < MIN_SECONDS || numValue > MAX_SECONDS) {
                setError(
                    localize('Please enter a duration between {{min}} to {{max}} seconds.', {
                        min: MIN_SECONDS,
                        max: MAX_SECONDS,
                    })
                );
                return false;
            }

            setError('');
            return true;
        },
        [localize]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setInputValue(value);

            if (value.endsWith('.') || value.endsWith(',')) {
                setError(localize('Should be a valid number.'));
                return;
            }

            if (value) {
                validateInput(value);
            } else {
                setError('');
            }
        },
        [localize, validateInput]
    );

    const handleSave = useCallback(() => {
        if (!validateInput(inputValue)) {
            return;
        }

        onChangeMultiple({
            duration_unit: 's',
            duration: Number(inputValue),
            expiry_type: 'duration',
        });
        onClose();
    }, [inputValue, validateInput, onChangeMultiple, onClose]);

    const getRangeMessage = () => (
        <Localize
            i18n_default_text='Range: {{min}} - {{max}} seconds'
            values={{
                min: MIN_SECONDS,
                max: MAX_SECONDS,
            }}
        />
    );

    return (
        <div className='duration-input-desktop__wrapper'>
            <TextField
                label={localize('Seconds')}
                name='duration'
                value={inputValue}
                onChange={handleInputChange}
                placeholder={localize('Seconds')}
                variant='outline'
                inputMode='numeric'
                maxLength={2}
                message={error || getRangeMessage()}
                status={error ? 'error' : 'neutral'}
                noStatusIcon
                data-testid='dt_duration_input_desktop'
            />
            <div className='duration-input-desktop__footer'>
                <Button
                    fullWidth
                    size='lg'
                    variant='secondary'
                    onClick={handleSave}
                    disabled={!!error || !inputValue}
                    className='duration-input-desktop__save-button'
                >
                    <Localize i18n_default_text='Save' />
                </Button>
            </div>
        </div>
    );
});

export default DurationInputDesktop;
