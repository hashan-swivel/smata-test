import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const dollarMask = createNumberMask({ prefix: '$', allowDecimal: true, allowNegative: true });
const spMask = createNumberMask({ prefix: 'Plan Number', includeThousandsSeparator: false });
const abnMask = [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];
const bsbMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

export const DollarInput = (props) => {
  const { input, disabled } = props;
  return <MaskedInput mask={dollarMask} placeholder='$' {...input} className='input' disabled={disabled} />;
};

export const AbnInput = (props) => {
  const { input, disabled } = props;
  return <MaskedInput mask={abnMask} {...input} disabled={disabled} />;
};

export const BsbInput = (props) => {
  const { input, disabled } = props;
  return <MaskedInput mask={bsbMask} {...input} disabled={disabled} />;
};

export const SpInput = (props) => {
  const { input, disabled } = props;
  return <MaskedInput mask={spMask} placeholder='Plan Number' {...input} disabled={disabled} />;
};
