using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Navigator.Contracts.Models
{
    public class KpiDashboardContract
    {
        public IEnumerable<KpiCategoryContract> Categories { get; set; }
    }

    public class KpiCategoryContract
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<KpiChartContract> Charts { get; set; }
    }
}
