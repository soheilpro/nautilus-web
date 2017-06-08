import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

export default function Splash() {
  return (
    <div className="splash-component">
      <div className="container">
        <img className="logo" src={`/assets/${require('../../assets/images/logo.svg')}`} />
      </div>
    </div>
  );
}
