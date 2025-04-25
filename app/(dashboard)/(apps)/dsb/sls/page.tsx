'use client';

import SalesByPeriodAndPoTypeChart from '../../imc/dashboard/salesByPoType/page';
import SalesByPeriodChart from '../../imc/dashboard/salesYearPeriod/page';
import SalesInvoiceHdPage from '../../sls/invoice-hd/list/page';

const SalesDashboardPage = () => {
  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Bagian Chart */}

      <div className='flex flex-col md:flex-row w-full gap-4'>
        <div className='flex-3 w-full md:w-1/2'>
          <SalesByPeriodChart />
        </div>
        <div className='flex-1 w-full md:w-1/2'>
          <SalesByPeriodAndPoTypeChart />
        </div>
      </div>

      {/* Bagian Table */}
      <div className='w-full flex-1'>
        <SalesInvoiceHdPage />
      </div>
    </div>
  );
};

export default SalesDashboardPage;
