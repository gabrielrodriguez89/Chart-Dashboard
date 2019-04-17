using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Navigator.Service.Models.DomainModels
{
    /// <summary>
    /// kpi chart data sets 
    /// </summary>
    public class KpiDataSet
    {
        /// <summary>
        /// database created primary key
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// foreign key for associated chart
        /// </summary>
        public int ChartId { get; set; }
        /// <summary>
        /// name of datapoint point collection (or title for collection)
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// a collection of kpi chart data points
        /// </summary>
        public virtual ICollection<KpiPoint> Points { get; set; }
        [ForeignKey("ChartId")]
        public virtual KpiChart Chart { get; set; }
    }
}