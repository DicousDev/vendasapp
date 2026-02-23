"use client"

import "bulma/css/bulma.css"
import "primereact/resources/primereact.min.css"
import "primereact/resources/themes/md-light-indigo/theme.css"
import 'primeflex/primeflex.css'
import { Dashboard, Layout, RotaAutenticada } from "@/components";
import { useDashboardService } from "./services"
import { DashboardData } from "./models/dashboard"

interface HomeProps {
  dashboard: DashboardData
}

const Home: React.FC<HomeProps> = async (props: HomeProps) => {

  const dashboardService = useDashboardService();
  const dashboard: DashboardData = dashboardService.get();

  return (
    <RotaAutenticada>
      <Layout titulo="Dashboard">
        <Dashboard vendasPorMes={props.dashboard.vendasPorMes || []} clientes={dashboard.clientes || 0} produtos={dashboard.produtos || 0} vendas={dashboard.vendas || 0} />
      </Layout>
    </RotaAutenticada>
  );
}

export default Home;
