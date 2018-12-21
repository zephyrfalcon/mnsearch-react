import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { normalizeCardName } from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('helper functions', () => {

  it('normalizes names properly', () => {
    expect(normalizeCardName("Barak")).toBe("Barak");
    expect(normalizeCardName("O'Qua")).toBe("OQua");
    expect(normalizeCardName("Abwyn's Gift")).toBe("Abwyns_Gift");
    expect(normalizeCardName("Ummm...NO!")).toBe("UmmmNO");
  });

});