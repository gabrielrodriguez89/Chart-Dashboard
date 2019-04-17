using Clients.Adapter.Models;
using Navigator.Client.Models.ViewModels;
using Navigator.Contracts.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.WebPages;
using static Navigator.Client.Models.ViewModels.HighChartViewModel;

namespace Navigator.Client.Proxies
{
    public class DivisionsProxy
    {
        #region DECLARATIONS

        private const string KpiDashboardDiscoveryRoute = "RemovedRouteConfig";

        private readonly IClient _client;

        #endregion

        #region CONSTRUCTORS

        public DivisionsProxy(IClient client)
        {
            _client = client;
        }
        #endregion

        /// <summary>
        /// Get all kpi chart 
        /// </summary>
        /// /// <param KpiDashboardContract="model"></param>
        /// <returns></returns>
        /// 
        //TODO add async - This is just for testing
        public async Task<KpiDashboardContract> GetKpiDashboardAsync()
        {
            //var kpiContract = InitContracts();

            return await _client.GetAsync<KpiDashboardContract>($"{KpiDashboardDiscoveryRoute}");
        }
        /// <summary>
        /// Get kpi chart data by id
        /// </summary>
        /// /// <param int="id"></param>
        /// <returns></returns>
        /// 
        public async Task<KpiChartContract> GetChartDataByIdAsync(int id)
        {
            return await _client.GetAsync<KpiChartContract>($"{KpiDashboardDiscoveryRoute}/chart/{id}");
        }
        /// <summary>
        /// puts edited kpi chart 
        /// </summary>
        /// /// <param KpiDashboardContract="model"></param>
        /// <returns></returns>
        public async Task PutChartDataAsync(KpiChartContract chart)
        {
            await _client.PutAsync($"{KpiDashboardDiscoveryRoute}/chart", chart);
        }   
        /// <summary>
        /// puts edited kpi chart 
        /// </summary>
        /// /// <param KpiDashboardContract="model"></param>
        /// <returns></returns>
        public async Task PutCategoryAsync(KpiCategoryContract category)
        {
            await _client.PutAsync($"{KpiDashboardDiscoveryRoute}/category", category);
        }
        /// <summary>
        /// posts new kpi chart 
        /// </summary>
        /// /// <param KpiDashboardContract="model"></param>
        /// <returns></returns>
        public async Task<int> PostChartDataAsync(KpiChartContract chart)
        {
            return await _client.PostWithResultAsync<int>($"{KpiDashboardDiscoveryRoute}/chart", chart);
        }

        public async Task PutChartContentAsync(KpiAdditionalContentContract content)
        {
            await _client.PutAsync($"{KpiDashboardDiscoveryRoute}/content", content);
        }
        /// <summary>
        /// delete chart by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task DeleteChartDataAsync(int id)
        {
            await _client.DeleteAsync($"{KpiDashboardDiscoveryRoute}/chart/{id}");
        }
    }
}