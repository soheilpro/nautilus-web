import * as React from 'react';

export default function Loading() {
  return (
    <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translateX(-50%) translateY(-40%)' }}>
      <img src={require('../../assets/images/logo.svg') as string} width="200" />
    </div>
  );
}
