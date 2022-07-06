import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";
import {ReactQueryDevtools} from "react-query/devtools"
import { ThemeProvider } from "styled-components";
import App from './App';
import GlobalStyles from "./styles/GlobalStyle";
import theme from "./styles/theme";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <ReactQueryDevtools initialIsOpen={true}/>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);