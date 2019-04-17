using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static Navigator.Client.Models.ViewModels.HighChartViewModel;

namespace Navigator.Client.Models.ViewModels
{
    public class KpiDashboardViewModel
    {
        //public IEnumerable<HighChartViewModel> EmailSubscriptions { get; set; }
        //public IEnumerable<HighChartViewModel> SocialChannels { get; set; }
        //public IEnumerable<HighChartViewModel> PageViewTotals { get; set; }
        //public IEnumerable<JobViewModel> JobViews { get; set; }
        //public IEnumerable<TotalsViewModel> MonthlyAppliedTotals { get; set; }
        //public IEnumerable<TotalsViewModel> MonthlyJobTotals { get; set; }
        public IEnumerable<DashboardCategoryViewModel> Categories { get; set; }

        public KpiDashboardViewModel()
        {
            //EmailSubscriptions = new List<HighChartViewModel>();
            //SocialChannels = new List<HighChartViewModel>();
            //JobViews = new List<JobViewModel>();
            //PageViewTotals = new List<HighChartViewModel>();
            //MonthlyAppliedTotals = new List<TotalsViewModel>();
            //MonthlyJobTotals = new List<TotalsViewModel>();
            Categories = new List<DashboardCategoryViewModel>();
        }
    }

    //public class PageViewTotals
    //{
    //    public string TitleOfPage { get; set; }
    //    public List<TotalsViewModel> PageTotals { get; set; }
    //}

    //public class TotalsViewModel
    //{ 
    //    public string Category { get; set; }
    //    public int AllTimePageViews { get; set; }
    //}

    //public class JobViewModel
    //{
    //    public string Category { get; set; }
    //    public int NumberOfJobs { get; set; }
    //    public int ApplyNow { get; set; }
    //    public int AllTimeApplyNow { get; set; } 
    //}

    public class DashboardCategoryViewModel
    {
        public string Name { get; set; }
        public IEnumerable<DashboardChartViewModel> Charts { get; set; }

        public DashboardCategoryViewModel()
        {
            Charts = new List<DashboardChartViewModel>();
        }
    }

    public class DashboardChartViewModel
    {
        public int Id { get; set; }
        public IEnumerable<Series> SeriesList { get; set; }
        public HighChartViewModel ChartConfig { get; set; }

        public DashboardChartViewModel() {
            SeriesList = new List<Series>();
        }
    }
}