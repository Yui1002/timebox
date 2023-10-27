import React from 'react';

export const UserContext = React.createContext<{email: null | string}>({
  email: null,
});
