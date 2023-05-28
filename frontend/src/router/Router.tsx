import Top from '../components/Top';
import TrainingLog from '../components/TrainingLog';
import SelectEvent from '../components/SelectEvent';
import Register from '../components/Register';
import AddTrainingEvent from '../components/AddTrainingEvent';
import AddTrainingEventDetail from '../components/AddTrainingEventDetail';
import EditEvent from '../components/EditEvent';
import MenuSetting from '../components/MenuSetting';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Router = () => {
  return  (
    <BrowserRouter>
      <Routes>
        <Route path="/training/top" element={<Top />} />
        <Route path="/training/Log" element={<TrainingLog />} />
        <Route path="/training/selectEvent" element={<SelectEvent />} />
        <Route path="/training/register" element={<Register />} />
        <Route path="/training/addEvent" element={<AddTrainingEvent />} />
        <Route path="/training/addEvent/:id" element={<AddTrainingEventDetail />} />
        <Route path="/training/editEvent" element={<EditEvent />} />
        <Route path="/training/menuSetting" element={<MenuSetting />} />
        <Route path="*" element={ <p>There's nothing here!</p> } />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;