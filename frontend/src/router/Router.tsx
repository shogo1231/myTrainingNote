import AccountList from '../components/AccountList';
import TrainingLog from '../components/TrainingLog';
import SelectEvent from '../components/SelectEvent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const Router = () => {
  return  (
    <BrowserRouter>
      <Routes>
        <Route path="/accountlist" element={<AccountList />} />
        <Route path="/Log" element={<TrainingLog />} />
        <Route path="/selectEvent" element={<SelectEvent />} />
        <Route path="*" element={ <p>There's nothing here!</p> } />
      </Routes>
    </BrowserRouter>
  )
}