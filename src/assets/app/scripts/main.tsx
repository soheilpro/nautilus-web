import * as React from 'react';
import * as ReactDOM from 'react-dom';
import config from './config';
import { Nautilus } from './nautilus';
import { NautilusClient } from './sdk/client';
import { App } from './components/app';

var client = new NautilusClient();
client.address = config.api.address;

Nautilus.Instance = new Nautilus(client);

ReactDOM.render(
  <App />,
  $('#app')[0]
);
