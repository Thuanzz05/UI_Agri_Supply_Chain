import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Login from './pages/Login';
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <div className="App">
        <Login />
      </div>
    </ConfigProvider>
  );
}

export default App;
