import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import VersionConfig from '@/pages/VersionConfig';
import Segmentation from '@/pages/Segmentation';
import Metrics from '@/pages/Metrics';
import Conclusion from '@/pages/Conclusion';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experiments" element={<Home />} />
          <Route path="/experiments/:id/version" element={<VersionConfig />} />
          <Route path="/experiments/:id/segmentation" element={<Segmentation />} />
          <Route path="/experiments/:id/metrics" element={<Metrics />} />
          <Route path="/experiments/:id/conclusion" element={<Conclusion />} />
        </Routes>
      </Layout>
    </Router>
  );
}
