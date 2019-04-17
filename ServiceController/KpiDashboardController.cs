using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using JsonPatch;
using Microsoft.Web.Http;
using Navigator.Contracts.Models;
using Navigator.Service.Filters;
using Navigator.Service.Helpers;
using Navigator.Service.Repositories;
using Navigator.Service.Results;

namespace Navigator.Service.Controllers
{
    /// <summary>
    /// KPI Dashboard api
    /// </summary>
    [ApiVersion("1")]
    [RoutePrefix("api/v{version:apiVersion}/KpiDashboard")]
    public class KpiDashboardController : ApiController
    {

        private readonly KPIDashboardRepository _repository;

        public KpiDashboardController()
        {
            _repository = new KPIDashboardRepository();
        }

        #region GET

        [Route("", Name = "ChartDataById")]
        [ResponseType(typeof(KpiDashboardContract))]
        public async Task<IHttpActionResult> GetKpiDashboard()
        {
            return Ok(await _repository.GetKpiDashboardAsync());
        }

        [Route("chart/{id:int}")]
        [ResponseType(typeof(KpiChartContract))]
        public async Task<IHttpActionResult> GetChart(int id)
        {
            return Ok(await _repository.GetChartDataByIdAsync(id));
        }
        #endregion

        #region PUT

        [Route("chart")]
        [ValidateModelState]
        public async Task<IHttpActionResult> PutChart([FromBody]KpiChartContract contract)
        {
            await _repository.PutChartDataAsync(contract);

            return new NoContentResponse();
        }

        [Route("category")]
        public async Task<IHttpActionResult> PutCategory([FromBody]KpiCategoryContract contract)
        {
            await _repository.PutCategoryAsync(contract);

            return new NoContentResponse();
        }

        [Route("content")]
        public async Task<IHttpActionResult> PutContent([FromBody]KpiAdditionalContentContract content)
        {
            await _repository.PutContentAsync(content);

            return new NoContentResponse();
        }
        #endregion

        #region POST

        [Route("chart")]
        [ValidateModelState]
        [ResponseType(typeof(int))]
        public async Task<IHttpActionResult> PostChart([FromBody]KpiChartContract contract)
        {
            var chartId = await _repository.PostChartDataAsync(contract);


            return CreatedAtRoute("ChartDataById", new { id = chartId}, chartId);
        }

        #endregion

        #region DELETE

        [Route("chart/{id:int}")]
        public async Task<IHttpActionResult> DeleteChart(int id)
        {
            await _repository.DeleteChartDataAsync(id);

            return new NoContentResponse();
        }

        #endregion
    }
}