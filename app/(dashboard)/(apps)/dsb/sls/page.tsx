import SalesByPeriodAndPoTypeChart from '../../imc/dashboard/salesByPoType/page';
import SalesComparisonChart from '../../imc/dashboard/salesYearPeriod/page';
import SalesInvoiceHdPage from '../../sls/invoice-hd/list/page';

const SalesDashboardPage = async () => {
  return (
    <div className='flex flex-col h-screen w-full p-4 gap-4'>
      {/* Bagian Atas: SalesComparisonChart dan SalesByPeriodAndPoTypeChart */}
      <div className='flex flex-col md:flex-row w-full gap-4'>
        {/* SalesComparisonChart: 3/4 lebar pada layar besar */}
        <div className='flex-3 w-full md:w-3/4'>
          <SalesComparisonChart />
        </div>
        {/* SalesByPeriodAndPoTypeChart: 1/4 lebar pada layar besar */}
        <div className='flex-1 w-full md:w-1/4'>
          <SalesByPeriodAndPoTypeChart />
        </div>
      </div>

      {/* Bagian Bawah: SalesInvoiceHdPage (full width) */}
      <div className='w-full flex-1'>
        <SalesInvoiceHdPage />
      </div>
    </div>
  );
};

export default SalesDashboardPage;
