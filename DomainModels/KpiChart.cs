using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Navigator.Service.Models.DomainModels
{
    /// <summary>
    /// kpi chart data 
    /// </summary>
    public class KpiChart
    {
        /// <summary>
        /// database generated primary key
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// title of chart
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// subtitle of chart
        /// </summary>
        public string Subtitle { get; set; }
        /// <summary>
        /// type of chart to display i.e('pie','line','column')
        /// </summary>
        public string ChartType { get; set; }
        /// <summary>
        /// bool value representing if the chart has a legend below
        /// </summary>
        public bool? Legend { get; set; }
        /// <summary>
        /// the values that are shown below the datapoint as a label
        /// </summary>
        public string XAxisLabel { get; set; }
        /// <summary>
        /// y axis label for chart
        /// </summary>
        public string YAxisLabel { get; set; }
        /// <summary>
        /// display order
        /// </summary>
        public int DisplayOrder { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AttachmentUrl { get; set; }
 
        /// <summary>
        /// collection of datapoints for the chart
        /// </summary>
        public virtual ICollection<KpiDataSet> DataSets { get; set; }

        public int? AdditionalContentId { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [ForeignKey("AdditionalContentId")]
        public virtual KpiAdditionalContent AdditionalContent { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual KpiCategory Category { get; set; }
 
    }
}