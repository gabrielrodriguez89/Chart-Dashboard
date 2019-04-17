using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Navigator.Service.Models.DomainModels
{
    /// <summary>
    /// chart data points for the kpi dashboard
    /// </summary>
    public class KpiPoint
    {
        /// <summary>
        /// database generated id
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// x axis value for chart
        /// </summary>
        public string X { get; set;}
        /// <summary>
        /// y axis value for chart
        /// </summary>
        public string Y { get; set; }
        public int DataSetId { get; set; }
        [ForeignKey("DataSetId")]
        public virtual KpiDataSet DataSet { get; set; }

    }
}