'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import DataProvider from './DataProvider';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useState with initializer function - runs only once
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <Provider store={store}>
      <DataProvider>{children}</DataProvider>
    </Provider>
  );
}
