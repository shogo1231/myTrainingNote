import AccountList from '../components/AccountList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const Router = () => {
  return  (
    <BrowserRouter>
      <Routes>
        <Route path="/accountlist" element={<AccountList />} />
        <Route path="*" element={ <p>There's nothing here!</p> } />
      </Routes>
    </BrowserRouter>
  )
}