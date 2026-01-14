import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

import { TradeParameterPopover, useTradeParameterPopover } from '../Shared';
import { TTradeParametersProps } from '../trade-parameters';

const PayoutPerPointContent: React.FC<{
    payout_per_point_list: { value: string; label: string }[];
    payout_per_point: string;
    onPayoutSelect: (value: string) => void;
}> = ({ payout_per_point_list, payout_per_point, onPayoutSelect }) => {
    const { closePopover } = useTradeParameterPopover();

    const handlePayoutSelectAndClose = useCallback(
        (payout: string) => {
            onPayoutSelect(payout);
            closePopover();
        },
        [onPayoutSelect, closePopover]
    );

    return (
        <div className='payout-per-point-popover__content'>
            {payout_per_point_list.map(({ value, label }) => {
                const isSelected = value === payout_per_point;

                return (
                    <button
                        key={value}
                        type='button'
                        className={clsx('payout-per-point-popover__option', {
                            'payout-per-point-popover__option--selected': isSelected,
                        })}
                        onClick={() => handlePayoutSelectAndClose(value)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

const PayoutPerPointDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { currency, is_market_closed, payout_choices, payout_per_point, setPayoutPerPoint } = useTraderStore();

    const currency_display_code = getCurrencyDisplayCode(currency);
    const payout_per_point_list = useMemo(
        () =>
            [...payout_choices]
                .sort((a, b) => Number(a) - Number(b))
                .map((payout: string) => ({
                    value: payout,
                    label: `${payout} ${currency_display_code}`,
                })),
        [payout_choices, currency_display_code]
    );

    const handlePayoutSelect = useCallback(
        (payout: string) => {
            setPayoutPerPoint(payout);
        },
        [setPayoutPerPoint]
    );

    return (
        <TradeParameterPopover
            popoverWidth={154}
            label={
                <Localize
                    i18n_default_text='Payout per point'
                    key={`payout-per-point${is_minimized ? '-minimized' : ''}`}
                />
            }
            value={`${payout_per_point} ${currency_display_code}`}
            is_minimized={is_minimized}
            disabled={is_market_closed}
            popover_classname='payout-per-point-popover'
        >
            <PayoutPerPointContent
                payout_per_point_list={payout_per_point_list}
                payout_per_point={payout_per_point}
                onPayoutSelect={handlePayoutSelect}
            />
        </TradeParameterPopover>
    );
});

export default PayoutPerPointDesktop;
