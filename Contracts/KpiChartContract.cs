using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Navigator.Contracts.Models
{
    public class KpiChartContract
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string ChartType { get; set; }
        public bool? Legend { get; set; }
        public string XAxisLabel { get; set; }
        public string YAxisLabel { get; set; }
        public string AttachmentUrl { get; set; }
        public IEnumerable<KpiChartDataSetContract> DataSets { get; set; }
        public KpiAdditionalContentContract AdditionalContent { get; set; }
        public int CategoryId { get; set; }

        public KpiChartContract()
        {
            DataSets = new List<KpiChartDataSetContract>();
            AdditionalContent = new KpiAdditionalContentContract();
        }
    }

    public class KpiAdditionalContentContract
    {
        public int Id { get; set; }
        [AllowHtml]
        [DataType(DataType.Html)]
        public string Content { get; set; }
    }
    public class KpiChartDataSetContract
    {
        public string Name { get; set; }
        public IEnumerable<KpiChartDataPointContract> Points { get; set; }
    }

    public class KpiChartDataPointContract
    {
        // TODO: some sense of X and Y type so these aren't locked in
        public string X { get; set; }
        public string Y { get; set; }
    }
}
