using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Navigator.Service.Models.DomainModels
{
    public class KpiCategory
    {
        /// <summary>
        /// database generated id
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public virtual ICollection<KpiChart> Charts { get; set; }
    }
}