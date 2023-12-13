import Image from 'next/image';
import React from 'react';

export const Logo = () => {
  return (
    <Image src='/images/logo.png' alt='Logo' width={56} height={56} style={{ borderRadius: 4 }} />
  );
};
