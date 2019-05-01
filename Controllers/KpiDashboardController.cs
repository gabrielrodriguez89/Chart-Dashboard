using System.Web.Mvc;
using Clients.Adapter.Models;
using Navigator.Client.Proxies;
using Navigator.Contracts.Models;
using Microsoft.Practices.Unity;
using System.Threading.Tasks;
using System.Net;

namespace Navigator.Client.Controllers
{

    public class KpiDashboardController : BaseController
    {
        #region DECLARATIONS

        private readonly DivisionsProxy _proxy;
        private readonly MyEmmaProxy _emmaProxy;

        #endregion

        #region Constructors

        public KpiDashboardController()
        {
            _proxy = new DivisionsProxy(UnityConfig.GetConfiguredContainer().Resolve<IClient>());
            _emmaProxy = new MyEmmaProxy(UnityConfig.GetConfiguredContainer().Resolve<IClient>("PopHttpClientProxy"));
        }

        #endregion

        #region KPI DASHBOARD
        // KPI Dashboard MUST go before corporate comms route
        [HttpGet]
        public async Task<ActionResult> GetCurrentMyEmmaTotals(int mailingId, string name)
        {
            var result = await _emmaProxy.GetMyEmmaById(mailingId, name);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public async Task<ActionResult> GetMyEmmaTotalsByFilter(string name, string year = "")
        {
            var result = await _emmaProxy.GetCurrentMonthlyTotalsByFilterAsync(name, year);
            ViewBag.EmmaMailings = result;
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        //TODO: add await and async after testing
        [HttpGet]
        [Route("KPIDashboard")]
        public async Task<ActionResult> KPIDashboard()
        {
            ViewBag.IsAdmin = User.IsInRole(Config.KPIMods);

            var model = await _proxy.GetKpiDashboardAsync();

            ViewBag.EmmaGroups = await _emmaProxy.GetAllMyEmmaGroups();

            return View(model);
        }
        [HttpGet]
        [Route("KPIDashboard/id")]
        public async Task<ActionResult> KPIDashboard(int id)
        {
            var chart = await _proxy.GetChartDataByIdAsync(id);

            return View(chart);
        }

        [HttpPut]
        public async Task<HttpStatusCodeResult> EditKPIChart(KpiChartContract chart)
        {
            if (!ModelState.IsValid)
            {

            }

            await _proxy.PutChartDataAsync(chart);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPut]
        public async Task<HttpStatusCodeResult> EditKPICategory(KpiCategoryContract category)
        {
            if (!ModelState.IsValid)
            {

            }

            await _proxy.PutCategoryAsync(category);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPut]
        public async Task<ActionResult> EditChartContent(KpiAdditionalContentContract content)
        {
            await _proxy.PutChartContentAsync(content);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<ActionResult> CreateKPIChart(KpiChartContract chart)
        {
            if (!ModelState.IsValid)
            {

            }
            //var additionalInfo = new KpiAdditionalContentContract
            //{
            //    ChartId = 0,
            //    Content = ""
            //};
            //chart.AdditionalContent = additionalInfo;

            var newId = await _proxy.PostChartDataAsync(chart);

            return Json(newId);
        }

        [HttpDelete]
        public async Task<HttpStatusCodeResult> DeleteKPIChart(int id)
        {
            await _proxy.DeleteChartDataAsync(id);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }
        #endregion
    }
}