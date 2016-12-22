import * as React from 'react';

require('./index.less');

export default function Splash() {
  return (
    <div className="splash component">
      <div className="container">
        <img src={require('../../assets/images/logo.svg') as string} />
      </div>
    </div>
  );
}
