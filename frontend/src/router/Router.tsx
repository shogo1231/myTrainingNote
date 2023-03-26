import AccountList from '../components/AccountList';
import TrainingLog from '../components/TrainingLog';
import SelectEvent from '../components/SelectEvent';
import Register from '../components/Register';
import AddTrainingEvent from '../components/AddTrainingEvent';
import AddTrainingEventDetail from '../components/AddTrainingEventDetail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Router = () => {
  return  (
    <BrowserRouter>
      <Routes>
        <Route path="/training/accountlist" element={<AccountList />} />
        <Route path="/training/Log" element={<TrainingLog />} />
        <Route path="/training/selectEvent" element={<SelectEvent />} />
        <Route path="/training/register" element={<Register />} />
        <Route path="/training/addTrainingEvent" element={<AddTrainingEvent />} />
        <Route path="/training/addTrainingEvent/:id" element={<AddTrainingEventDetail />} />
        <Route path="*" element={ <p>There's nothing here!</p> } />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;