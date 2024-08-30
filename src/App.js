import React from "react";
import UserList from "./components/UserList";

/**
 * Configuration for the application.
 */
export const config = {
  endpoint: "https://jsonplaceholder.typicode.com",
};

/**
 * Root component of the application.
 */
const App = () => {
  return (
    <div className="app">
      <UserList />
    </div>
  );
};

export default App;
