using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Navigator.Contracts.Models;
using Navigator.Service.Helpers;
using Navigator.Service.Models.DomainModels;
using NinjaNye.SearchExtensions;
using System.Linq.Dynamic;


namespace Navigator.Service.Repositories
{
    /// <summary>
    /// kpi dashboard repository
    /// </summary>
    public class KPIDashboardRepository : BaseRepository
    {
        #region GET

        public async Task<KpiDashboardContract> GetKpiDashboardAsync()
        {
            var categories = await Context.KpiCategories.ToListAsync();

            var mappedCategories = categories
                .OrderBy(c => c.DisplayOrder)
                .Select(KPIDashboardMapper.CategoryEntityToContract);

            var result = new KpiDashboardContract
            {
                Categories = mappedCategories
            };

            return result; 
        }

        public async Task<KpiChartContract> GetChartDataByIdAsync(int id)
        {
            var chartData = await Context.KpiCharts.FindAsync(id);

            if(chartData == null)
            {
                throw new CannotFindIdException("chart", id);
            }

            var result = KPIDashboardMapper.ChartEntityToContract(chartData);

            return result;
        }

        #endregion
        /// <summary>
        /// 
        /// </summary>
        /// <param name="contract"></param>
        /// <returns></returns>
        #region POST
        public async Task<int> PostChartDataAsync(KpiChartContract contract)
        {
            if(Context.KpiCharts.Find(contract.Id) != null)
            {
                throw new EntityConflictException("chart", contract.Id);
            }

            var newChart = KPIDashboardMapper.ChartContractToEntity(contract);

            var category = Context.KpiCategories.Find(contract.CategoryId);
            if (category == null)
            {
                throw new CannotFindIdException("category", contract.CategoryId);
            }
            newChart.DisplayOrder = category.Charts.Count() + 1;

            Context.KpiCharts.Add(newChart);

            Context.Entry(newChart).State = EntityState.Added;

            var isSaved = await Context.SaveChangesAsync();

            if (isSaved <= 0)
            {
                throw new CannotSaveToDatabaseException("chart");
            }

            return newChart.Id;
        }

        #endregion
        /// <summary>
        /// 
        /// </summary>
        /// <param name="contract"></param>
        /// <returns></returns>
        #region PUT
        public async Task PutChartDataAsync(KpiChartContract contract)
        {
            var existing = await Context.KpiCharts.FindAsync(contract.Id);

            if(existing == null)
            {
                throw new CannotFindIdException("chart", contract.Id);
            }

            var updated = KPIDashboardMapper.ChartContractToEntity(contract);

            Context.KpiDataSets.RemoveRange(Context.KpiDataSets.Where(x => x.ChartId == existing.Id));

            if (!Context.KpiAdditionalContents.Any(c => c.Id == updated.Id))
            {
                Context.KpiAdditionalContents.Add(updated.AdditionalContent);
            }
            else
            {
                Context.Entry(updated.AdditionalContent).State = EntityState.Modified;
            }
            
            existing.DataSets = contract.DataSets.Select(KPIDashboardMapper.DataSetContractToEntity).ToList();
            Context.Entry(existing).CurrentValues.SetValues(updated);
            Context.Entry(existing).State = EntityState.Modified;

            if (await Context.SaveChangesAsync() <= 0)
            {
                throw new CannotSaveToDatabaseException("chart");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="contract"></param>
        /// <returns></returns>
        public async Task PutCategoryAsync(KpiCategoryContract contract)
        {
            var existing = await Context.KpiCategories.FindAsync(contract.Id);

            if (existing == null)
            {
                throw new CannotFindIdException("category", contract.Id);
            }

            var updated = KPIDashboardMapper.CategoryContractToEntity(contract);

            Context.Entry(existing).CurrentValues.SetValues(updated);
            Context.Entry(existing).State = EntityState.Modified;

            if (await Context.SaveChangesAsync() <= 0)
            {
                throw new CannotSaveToDatabaseException("category");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task PutContentAsync(KpiAdditionalContentContract content)
        {
            var existing = await Context.KpiAdditionalContents.FindAsync(content.Id);

            if (existing == null)
            {
                throw new CannotFindIdException("content", content.Id);
            }

            var updated = KPIDashboardMapper.AdditionalContentContractToEntity(content);
            
            Context.Entry(existing).CurrentValues.SetValues(updated);
            Context.Entry(existing).State = EntityState.Modified;

            if (await Context.SaveChangesAsync() <= 0)
            {
                throw new CannotSaveToDatabaseException("content");
            }
        }
        #endregion

        #region DELETE
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task DeleteChartDataAsync(int id)
        {
            var chart = await Context.KpiCharts.FindAsync(id);

            if(chart == null)
            {
                throw new CannotFindIdException("chart", id);
            }

            Context.KpiCharts.Remove(chart);

            if(await Context.SaveChangesAsync() <= 0)
            {
                throw new CannotSaveToDatabaseException("chart");
            }
        }
        #endregion
    }
}